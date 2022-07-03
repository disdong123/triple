import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '@src/module/user/entities/user.entity';
import { PlaceEntity } from '@src/module/place/entities/place.entity';
import * as dayjs from 'dayjs';
import { DateTimeTransformer } from '@src/common/typeorm/transformer/date-time.transformer';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';
import { Point } from '@src/module/point/vo/point';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';
import { plainToClass } from 'class-transformer';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { ReviewResponse } from '@src/module/review/dto/review.response';

@Entity('review')
@Unique(['userId', 'placeId', 'isUsed'])
export class ReviewEntity {
  @PrimaryColumn({
    name: 'id',
    comment: 'ID',
    type: 'uuid',
    //type: 'varchar',
    nullable: false,
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
    name: 'place_id',
    comment: '장소 ID',
    type: 'uuid',
    //type: 'varchar',
    nullable: false,
  })
  placeId: string;

  @Column({
    name: 'content',
    comment: '리뷰내용',
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'tinyint',
    precision: 1,
    name: 'is_used',
    nullable: false,
    default: true,
  })
  isUsed: boolean;

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
  createdAt: dayjs.Dayjs;

  @Column({
    comment: '수정일시',
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    transformer: DateTimeTransformer,
  })
  updatedAt: dayjs.Dayjs;

  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    // createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PlaceEntity, (place) => place.reviews, {
    // createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'place_id' })
  place: PlaceEntity;

  @OneToMany(() => PointLogEntity, (pointLog) => pointLog.review, {
    cascade: ['insert'],
  })
  pointLogs: PointLogEntity[];

  @OneToMany(() => PhotoEntity, (photo) => photo.review, {
    cascade: ['insert'],
  })
  photos: PhotoEntity[];

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
   *
   */
  toString(): string {
    return JSON.stringify(this);
  }

  /**
   * content 에 수정사항이 있는 경우 point 를 부여할지 결정합니다.
   * @param prevContent
   */
  getPointDiffContent(prevContent: string): Point | null {
    const currentContentLength = this.content.trim().length;
    const prevContentLength = prevContent.trim().length;

    if (prevContentLength && !currentContentLength) {
      return new Point(PointTypeEnum.CONTENT, -1);
    } else if (!prevContentLength && currentContentLength) {
      return new Point(PointTypeEnum.CONTENT, 1);
    } else {
      return null;
    }
  }

  /**
   * photos 에 수정사항이 있는 경우 point 를 부여할지 결정합니다.
   * @param prevPhotos
   */
  getPointDiffPhotos(prevPhotos: PhotoEntity[]): Point | null {
    const currentPhotoLength = this.getUsedPhoto().length || 0;
    const prevPhotoLength = prevPhotos.length || 0;

    if (prevPhotoLength && !currentPhotoLength) {
      return new Point(PointTypeEnum.PHOTO, -1);
    } else if (!prevPhotoLength && currentPhotoLength) {
      return new Point(PointTypeEnum.PHOTO, 1);
    } else {
      return null;
    }
  }

  /**
   * 이미 존재했던 photo, 새로 입련된 photo, 공통으로 들어있는 photo 로 나눕니다.
   * @param currentPhotoIds
   */
  classifyPhotoIds(currentPhotoIds: string[]): classificationPhotoId {
    const exPhotoIds = this.photos.map((photo) => photo.id);
    const updateIds = exPhotoIds.filter((id) => currentPhotoIds.includes(id));
    const deleteIds = exPhotoIds.filter((id) => !currentPhotoIds.includes(id));
    const newIds = currentPhotoIds.filter((id) => !exPhotoIds.includes(id));

    return plainToClass(classificationPhotoId, {
      deleteIds,
      newIds,
      updateIds,
    });
  }

  /**
   * review 와 그와 관련된 photo 를 삭제합니다.
   */
  delete(): void {
    this.isDeleted = true;
    this.isUsed = false;
    this.photos.map((p) => (p.isDeleted = true));
  }

  /**
   * review 에 대한 포인트를 계산합니다.
   */
  getTotalPoint(): number {
    return this.pointLogs?.reduce((sum, curr) => (sum += curr.point), 0);
  }

  /**
   * 사용되는 사진만 보여줍니다.
   */
  getUsedPhoto(): PhotoEntity[] {
    return this.photos.filter((p) => !p.isDeleted).map((p) => p.copyEntity());
  }

  /**
   *
   */
  toReviewResponse(): ReviewResponse {
    return plainToClass(ReviewResponse, {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      pointLogs: this.pointLogs.map((pl) => pl.toPointLogResponse()),
      photos: this.photos
        .filter((p) => !p.isDeleted)
        .map((p) => p.toPhotoResponse()),
      totalPoint: this.getTotalPoint(),
    });
  }
}

/**
 *
 */
export class classificationPhotoId {
  deleteIds?: string[];
  newIds?: string[];
  updateIds?: string[];
}
