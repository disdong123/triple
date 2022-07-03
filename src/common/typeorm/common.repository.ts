import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';

/**
 * 공통 repository
 */
export class CommonRepository {
  protected readonly logger = new Logger(this.constructor.name);
  private _repository: Repository<any>;
  constructor(
    @InjectEntityManager()
    protected readonly _entityManager: EntityManager,
  ) {}

  get repository(): Repository<any> {
    return this._repository;
  }

  get entityManager(): EntityManager {
    return this._entityManager;
  }

  set repository(repository: Repository<any>) {
    this._repository = repository;
  }

  get connection(): Connection {
    return this.entityManager.connection;
  }

  /**
   *
   * @param classType
   */
  protected getRepository(classType: any): Repository<any> {
    return this.entityManager.getRepository(classType);
  }

  /**
   *
   */
  close() {
    return this.entityManager.connection.close();
  }
}
