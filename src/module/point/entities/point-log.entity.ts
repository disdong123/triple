import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateTimeTransformer } from '@src/common/typeorm/transformer/date-time.transformer';
import * as dayjs from 'dayjs';
import { UserEntity } from '@src/module/user/entities/user.entity';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { PointLogResponse } from '@src/module/point/dto/point-log.response';
import { plainToClass } from 'class-transformer';

/**
 * 포인트를 쌓습니다. 삭제되거나 수정되지 않습니다.
 * 포인트를 절감해야할 경우에는 음수를 저장합니다.
 * 매번 계산하지않고 user 에게 계산된 point 값을 저장할 컬럼을 하나 두는것이 좋아보입니다.
 */
@Entity('point_log')
export class PointLogEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'ID',
  })
  id: number;

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
    nullable: false,
  })
  reviewId: string;

  @Column({
    name: 'point',
    comment: '점수',
    type: 'int',
    nullable: false,
  })
  point: number;

  @Column({
    name: 'point_type',
    comment: '점수유형 (CONTENT, PHOTO, BONUS)',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  type: PointTypeEnum;

  @Column({
    comment: '등록일시',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    transformer: DateTimeTransformer,
  })
  createdAt: dayjs.Dayjs;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, (review) => review.pointLogs)
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdAt = dayjs();
  }

  /**
   *
   */
  toPointLogResponse(): PointLogResponse {
    return plainToClass(PointLogResponse, {
      id: this.id,
      point: this.point,
      type: this.type,
    });
  }
}
