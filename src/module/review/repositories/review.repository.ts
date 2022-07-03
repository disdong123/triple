import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CommonRepository } from '@src/common/typeorm/common.repository';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';
import { ApiTags } from '@nestjs/swagger';

/**
 *
 */
@Injectable()
export class ReviewRepository extends CommonRepository {
  constructor(
    @InjectEntityManager()
    protected readonly _entityManager: EntityManager,
  ) {
    super(_entityManager);
    this.repository = this.getRepository(ReviewEntity);
  }

  /**
   * 장소에 대해 삭제되지 않은 리뷰가 존재하는지 확인합니다.
   * @param placeId
   */
  findByPlaceId(placeId: string): Promise<ReviewEntity> {
    return this.entityManager
      .createQueryBuilder(ReviewEntity, 'rv')
      .where('place_id = :placeId', { placeId })
      .andWhere('is_deleted IS FALSE')
      .limit(1)
      .getOne();
  }

  /**
   * Todo. 삭제된 photo 를 갖고오고싶지 않다면 따로 is_deleted = false 인 photo 만 호출해야합니다.
   * @param reviewId
   * @param placeId
   * @param userId
   */
  findByReviewAndPlaceAndUserId(
    reviewId: string,
    placeId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    return this.entityManager
      .createQueryBuilder(ReviewEntity, 'rv')
      .innerJoinAndSelect('rv.user', 'u')
      .leftJoinAndSelect('rv.pointLogs', 'pl')
      .leftJoinAndSelect('rv.photos', 'ph')
      .where('rv.id = :reviewId', { reviewId })
      .andWhere('rv.user_id = :userId', { userId })
      .andWhere('rv.place_id = :placeId', { placeId })
      .andWhere('rv.is_used IS TRUE')
      .andWhere('rv.is_deleted IS FALSE')
      .getOne();
  }
}
