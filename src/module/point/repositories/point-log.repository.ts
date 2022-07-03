import { EntityManager } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CommonRepository } from '@src/common/typeorm/common.repository';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';
import { Point } from '@src/module/point/vo/point';

/**
 *
 */
@Injectable()
export class PointLogRepository extends CommonRepository {
  constructor(
    @InjectEntityManager()
    protected readonly _entityManager: EntityManager,
  ) {
    super(_entityManager);
    this.repository = this.getRepository(PointLogEntity);
  }

  /**
   *
   * @param userId
   * @param reviewId
   * @param points
   */
  createPointInstances(
    userId: string,
    reviewId: string,
    points: Point[] | null,
  ): PointLogEntity[] {
    return this.entityManager.create(
      PointLogEntity,
      points
        .filter((p) => p !== null)
        .map((p) => {
          return {
            userId,
            reviewId,
            point: p.value,
            type: p.type,
          };
        }),
    );
  }
}
