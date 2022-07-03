import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ReviewRepository } from '@src/module/review/repositories/review.repository';
import { PointLogRepository } from '@src/module/point/repositories/point-log.repository';
import { TransactionService } from '@src/common/typeorm/transaction.service';
import { PhotoRepository } from '@src/module/photo/repositories/photo.repository';
import { Point } from '@src/module/point/vo/point';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { ReviewResponse } from '@src/module/review/dto/review.response';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';
import { PhotoService } from '@src/module/photo/photo.service';
import { QueryRunner } from 'typeorm';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';

/**
 *
 */
@Injectable()
export class ReviewService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly pointLogRepository: PointLogRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly transactionService: TransactionService,
    private readonly photoService: PhotoService,
  ) {}

  /**
   * review 를 생성합니다.
   * @param reviewId
   * @param userId
   * @param placeId
   * @param content
   * @param attachedPhotoIds
   */
  async add(
    reviewId: string,
    userId: string,
    placeId: string,
    content: string,
    attachedPhotoIds: string[],
  ): Promise<ReviewResponse> {
    this.logger.debug(`add(
      reviewId: ${reviewId},
      userId: ${userId},
      placeId: ${placeId},
      content: ${content},
      attachedPhotoIds: ${JSON.stringify(attachedPhotoIds)},
    )`);

    // 1. 이미 존재하는 reviewId, photoId 인지 확인합니다.
    await Promise.all([
      this.checkReviewById(reviewId),
      this.photoService.checkPhotoByIds(attachedPhotoIds),
    ]);

    // 2. bonus 포인트를 위해 리뷰가 이미 있는지 확인합니다.
    const reviewWithPlaceId = await this.reviewRepository.findByPlaceId(
      placeId,
    );

    this.logger.debug(
      `reviewWithPlaceId: ${JSON.stringify(reviewWithPlaceId)}`,
    );

    // 3. photo instance 를 생성합니다.
    const photoInstances = this.photoRepository.entityManager.create(
      PhotoEntity,
      attachedPhotoIds.map((id) => {
        return {
          id,
          userId,
          reviewId,
        };
      }),
    );

    this.logger.debug(`photoInstances: ${JSON.stringify(photoInstances)}`);

    // 4. pointLog instance 를 생성합니다.
    const pointLogInstances = this.pointLogRepository.createPointInstances(
      userId,
      reviewId,
      [
        Point.getBonusPoint(reviewWithPlaceId),
        Point.getContentPoint(content),
        Point.getPhotoCreatedPoint(attachedPhotoIds),
      ],
    );

    // review 를 저장합니다.
    const reviewInstance: ReviewEntity =
      this.reviewRepository.entityManager.create(ReviewEntity, {
        id: reviewId,
        userId,
        placeId,
        content,
        photos: photoInstances,
        pointLogs: pointLogInstances,
      });

    this.logger.debug(`reviewInstance: ${JSON.stringify(reviewInstance)}`);

    return (
      await this.reviewRepository.entityManager.save(
        ReviewEntity,
        reviewInstance,
      )
    ).toReviewResponse();
  }

  /**
   * review 를 수정합니다.
   * @param reviewId
   * @param userId
   * @param placeId
   * @param content
   * @param attachedPhotoIds
   */
  async modify(
    reviewId: string,
    userId: string,
    placeId: string,
    content: string,
    attachedPhotoIds: string[],
  ): Promise<ReviewResponse> {
    this.logger.debug(`add(
      reviewId: ${reviewId},
      userId: ${userId},
      placeId: ${placeId},
      content: ${content},
      attachedPhotoIds: ${JSON.stringify(attachedPhotoIds)},
    )`);

    // 1. 삭제되지 않은 photo 는 업데이트됩니다. 삭제된 photo 는 modify 를 진행할 수 없습니다.
    await this.photoService.checkDeletedPhotoByIds(attachedPhotoIds);

    // 2. 작성한 리뷰를 찾습니다.
    const reviewEntity = await this.findByReviewAndPlaceAndUserId(
      reviewId,
      placeId,
      userId,
    );

    const prevContent = reviewEntity.content;
    const prevPhotos = reviewEntity.getUsedPhoto();

    // 3. content 를 수정합니다.
    reviewEntity.content = content;

    // 4. photo 를 수정합니다.
    const { newIds, deleteIds, updateIds } =
      reviewEntity.classifyPhotoIds(attachedPhotoIds);

    // 4-1. 기존에 등록된 photo 를 삭제합니다.
    deleteIds.map(
      (id) => (reviewEntity.photos.find((p) => p.id === id).isDeleted = true),
    );

    // 4-2. 새로 등록된 photo 를 생성합니다. (updateIds 는 기존에 등록된 id 입니다. 지금은 굳이 함께 save 하지 않습니다.)
    const newPhotoInstance = [...newIds].map((id) =>
      this.photoRepository.entityManager.create(PhotoEntity, {
        id,
        userId,
        reviewId,
      }),
    );

    reviewEntity.photos = [...reviewEntity.photos, ...newPhotoInstance];

    // 4. 포인트를 저장합니다. attachedPhotoIds 가 하나도 없으면 리뷰에 대한 모든 사진이 삭제됩니다.
    const newPointLogInstances = this.pointLogRepository.createPointInstances(
      userId,
      reviewId,
      [
        reviewEntity.getPointDiffPhotos(prevPhotos),
        reviewEntity.getPointDiffContent(prevContent),
      ],
    );

    reviewEntity.pointLogs = [
      ...reviewEntity.pointLogs,
      ...newPointLogInstances,
    ];

    return this.transactionService.transactionCB<ReviewResponse>(
      async (runner: QueryRunner) => {
        const reviewRepository = new ReviewRepository(runner.manager);
        const pointLogRepository = new PointLogRepository(runner.manager);
        const photoRepository = new PhotoRepository(runner.manager);

        await pointLogRepository.entityManager.save(
          PointLogEntity,
          reviewEntity.pointLogs,
        );
        await photoRepository.entityManager.save(
          PhotoEntity,
          reviewEntity.photos,
        );

        delete reviewEntity.pointLogs;
        delete reviewEntity.photos;

        await reviewRepository.entityManager.save(ReviewEntity, reviewEntity);

        // 다시 조회하여 반환합니다.
        return (
          await reviewRepository.findByReviewAndPlaceAndUserId(
            reviewId,
            placeId,
            userId,
          )
        ).toReviewResponse();
      },
      this.logger,
    );
  }

  /**
   * review 를 삭제합니다.
   * @param reviewId
   * @param userId
   * @param placeId
   */
  async delete(
    reviewId: string,
    userId: string,
    placeId: string,
  ): Promise<boolean> {
    // 1. 작성한 리뷰를 찾습니다.
    const reviewEntity = await this.findByReviewAndPlaceAndUserId(
      reviewId,
      placeId,
      userId,
    );

    return this.transactionService.transactionCB<boolean>(
      async (runner: QueryRunner) => {
        const reviewRepository = new ReviewRepository(runner.manager);
        const photoRepository = new PhotoRepository(runner.manager);

        // 2. reviewEntity 를 삭제합니다.
        reviewEntity.delete();

        await photoRepository.entityManager.save(
          PhotoEntity,
          reviewEntity.photos,
        );

        delete reviewEntity.photos;
        delete reviewEntity.pointLogs;

        await reviewRepository.entityManager.save(ReviewEntity, reviewEntity);

        return true;
      },
      this.logger,
    );
  }

  /**
   * 이미 존재하는지 확인합니다.
   * @param reviewId
   */
  async checkReviewById(reviewId: string): Promise<void> {
    const review = await this.reviewRepository.entityManager.findOne(
      ReviewEntity,
      reviewId,
    );

    if (review) {
      this.logger.error(`review: ${JSON.stringify(review)}`);
      throw new HttpException(
        `이미 존재하는 reviewId 입니다. reviewId: ${reviewId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * review 가 없으면 예외처리, 있으면 반환합니다.
   * @param reviewId
   * @param placeId
   * @param userId
   */
  private async findByReviewAndPlaceAndUserId(
    reviewId: string,
    placeId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    // 1. 작성한 리뷰를 찾습니다.
    const reviewEntity =
      await this.reviewRepository.findByReviewAndPlaceAndUserId(
        reviewId,
        placeId,
        userId,
      );

    if (!reviewEntity) {
      this.logger.error(`reviewEntity: ${reviewEntity}`);
      throw new HttpException('Resource Not Found', HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`reviewEntity: ${reviewEntity.toString()}`);

    reviewEntity.photos = reviewEntity.getUsedPhoto();

    return reviewEntity;
  }
}
