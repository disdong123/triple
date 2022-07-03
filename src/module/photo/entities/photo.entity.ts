import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@src/module/user/entities/user.entity';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { PointLogResponse } from '@src/module/point/dto/point-log.response';
import { PhotoResponse } from '@src/module/photo/dto/photo.response';
import { UserReviewPointResponse } from '@src/module/user/dto/user-review-point.response';

@Entity('photo')
export class PhotoEntity {
  @PrimaryColumn({
    name: 'id',
    comment: 'ID',
    type: 'uuid',
    //type: 'varchar',
  })
  id: string;

  @Column({
    name: 'user_id',
    comment: '리뷰 작성자 ID',
    type: 'uuid',
    //type: 'varchar',
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'review_id',
    comment: '리뷰 ID',
    type: 'uuid',
    //type: 'varchar',
  })
  reviewId: string;

  @Column({
    type: 'tinyint',
    precision: 1,
    name: 'is_deleted',
    nullable: false,
    default: false,
  })
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, (review) => review)
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity;

  /**
   * 새 인스턴스를 리턴합니다.
   */
  copyEntity(): PhotoEntity {
    return plainToClass(PhotoEntity, this);
  }

  /**
   *
   */
  toPhotoResponse(): PhotoResponse {
    return plainToClass(PhotoResponse, {
      id: this.id,
    });
  }

  // /**
  //  * UserReviewPointResponse 로 변환합니다.
  //  */
  // toUserReviewPointResponse(): UserReviewPointResponse {
  //   return plainToClass(UserReviewPointResponse, {
  //     totalPoint: this.getTotalPointOnReview(),
  //   });
  // }

  // /**
  //  * 유저가 작성한 리뷰의 총 포인트를 가져옵니다.
  //  */
  // getTotalPointOnReview(): number {
  //   return this.reviews
  //     ?.map((r) => r.getTotalPoint())
  //     .reduce((sum, curr) => (sum += curr), 0);
  // }
}
