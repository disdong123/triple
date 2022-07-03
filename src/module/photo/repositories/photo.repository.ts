import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CommonRepository } from '@src/common/typeorm/common.repository';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';

/**
 *
 */
@Injectable()
export class PhotoRepository extends CommonRepository {
  constructor(
    @InjectEntityManager()
    protected readonly _entityManager: EntityManager,
  ) {
    super(_entityManager);
    this.repository = this.getRepository(PhotoEntity);
  }
}
