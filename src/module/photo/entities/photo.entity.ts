import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '@src/module/user/entities/user.entity';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { plainToClass, Type } from 'class-transformer';
import { PhotoResponse } from '@src/module/photo/dto/photo.response';
import * as dayjs from 'dayjs';
import { DateTimeTransformer } from '@src/common/typeorm/transformer/date-time.transformer';

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

  @Column({
    comment: '등록일시',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    transformer: DateTimeTransformer,
  })
  @Type(() => dayjs)
  createdAt: dayjs.Dayjs;

  @Column({
    comment: '수정일시',
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    transformer: DateTimeTransformer,
  })
  @Type(() => dayjs)
  updatedAt: dayjs.Dayjs;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, (review) => review)
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdAt = dayjs();
    this.updatedAt = dayjs();
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedAt = dayjs();
  }

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
