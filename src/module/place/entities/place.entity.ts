import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ReviewEntity } from '@src/module/review/entities/review.entity';

@Entity('place')
export class PlaceEntity {
  @PrimaryColumn({
    name: 'id',
    comment: 'ID',
    type: 'uuid',
    //type: 'varchar',
  })
  id: string;

  @Column({
    name: 'name',
    comment: '장소이름',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany(() => ReviewEntity, (review) => review.place)
  reviews: ReviewEntity[];
}
