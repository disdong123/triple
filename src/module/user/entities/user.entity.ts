import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { UserReviewPointResponse } from '@src/module/user/dto/user-review-point.response';
import { plainToClass } from 'class-transformer';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    name: 'id',
    comment: 'ID',
    type: 'uuid',
    //type: 'varchar',
  })
  id: string;

  @Column({
    name: 'name',
    comment: '사용자이름',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  /**
   * UserReviewPointResponse 로 변환합니다.
   */
  toUserReviewPointResponse(): UserReviewPointResponse {
    return plainToClass(UserReviewPointResponse, {
      totalPoint: this.getTotalPointOnReview(),
    });
  }

  /**
   * 유저가 작성한 리뷰의 총 포인트를 가져옵니다.
   */
  getTotalPointOnReview(): number {
    return this.reviews
      ?.map((r) => r.getTotalPoint())
      .reduce((sum, curr) => (sum += curr), 0);
  }
}
