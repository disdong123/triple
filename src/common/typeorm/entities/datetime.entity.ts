import * as dayjs from 'dayjs';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { DateTimeTransformer } from '@src/common/typeorm/transformer/date-time.transformer';

export class DatetimeEntity {
  @Column({
    comment: '생성일',
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    transformer: DateTimeTransformer,
  })
  createdAt: dayjs.Dayjs;

  @Column({
    comment: '수정일',
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    transformer: DateTimeTransformer,
  })
  updatedAt: dayjs.Dayjs;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = dayjs();
    this.updatedAt = dayjs();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = dayjs();
  }
}
