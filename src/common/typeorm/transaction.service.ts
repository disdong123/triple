import { Connection } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

/**
 * QueryRunner 를 사용하는 트랜잭션을 관리합니다.
 */
@Injectable()
export class TransactionService {
  constructor(private readonly connection: Connection) {}

  /**
   * transaction 으로 queryRunner 를 이용할 때 사용할 수 있습니다.
   * @param cb 실제로 수행되는 로직입니다.
   * @param logger 로거
   */
  async transactionCB<T>(cb: Function, logger: Logger): Promise<T> {
    const runner = this.connection.createQueryRunner();
    let result: T;

    try {
      await runner.startTransaction();

      result = await cb(runner);

      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      logger.debug(`rollback!`);
      logger.error(`err.message: ${err.message}`);
      throw err;
    } finally {
      await runner.release();
    }

    return result;
  }

  /**
   * 항상 rollback 합니다.
   * @param cb
   * @param logger
   */
  async transactionCBTest<T>(cb: Function, logger: Logger): Promise<T> {
    const runner = this.connection.createQueryRunner();
    let result: T;

    try {
      await runner.startTransaction();

      result = await cb(runner);

      await runner.rollbackTransaction();
      console.log('rollback!!');
    } catch (err) {
      await runner.rollbackTransaction();
      console.log('rollback!!');
      logger.error(`err.message: ${err.message}`);
      throw err;
    } finally {
      await runner.release();
    }

    return result;
  }
}
