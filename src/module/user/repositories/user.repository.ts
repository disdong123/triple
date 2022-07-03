import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CommonRepository } from '@src/common/typeorm/common.repository';
import { UserEntity } from '@src/module/user/entities/user.entity';

/**
 *
 */
@Injectable()
export class UserRepository extends CommonRepository {
  constructor(
    @InjectEntityManager()
    protected readonly _entityManager: EntityManager,
  ) {
    super(_entityManager);
    this.repository = this.getRepository(UserEntity);
  }

  /**
   *
   * @param userId
   */
  getTotalPointOnReview(userId: string): Promise<UserEntity> {
    return this.entityManager
      .createQueryBuilder(UserEntity, 'u')
      .leftJoinAndSelect('u.reviews', 'rv')
      .leftJoinAndSelect('rv.pointLogs', 'pl')
      .where('u.id = :userId', { userId })
      .andWhere('rv.is_used IS TRUE')
      .andWhere('rv.is_deleted IS FALSE')
      .getOne();
  }
}
