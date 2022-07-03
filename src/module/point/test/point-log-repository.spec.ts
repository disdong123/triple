import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewModule } from '@src/module/review/review.module';
import { CoreModule } from '@src/core/core.module';
import { PointLogRepository } from '@src/module/point/repositories/point-log.repository';
import { Point } from '@src/module/point/vo/point';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { DataService } from '@src/common/typeorm/seed-data.service';
import { TransactionService } from '@src/common/typeorm/transaction.service';
import { QueryRunner } from 'typeorm';

describe('PointLogRepository 테스트', () => {
  let app: INestApplication;
  let transactionService: TransactionService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ReviewModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    transactionService =
      moduleFixture.get<TransactionService>(TransactionService);
  }, 10000);

  describe('bulkCreateAndSave 테스트', () => {
    it('총 3개의 Point 에 대해 생성합니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const pointLogRepository = new PointLogRepository(runner.manager);
          const userId = '1';
          const reviewId = '1';
          const points = [
            new Point(PointTypeEnum.BONUS, 1),
            new Point(PointTypeEnum.CONTENT, 1),
            new Point(PointTypeEnum.PHOTO, -1),
          ];

          const result = pointLogRepository.createPointInstances(
            userId,
            reviewId,
            points,
          );

          expect(result[0].type).toEqual('BONUS');
          expect(result[1].type).toEqual('CONTENT');
          expect(result[2].point).toEqual(-1);
          expect(result.length).toEqual(3);
        },
        new Logger('test'),
      );
    });

    it('총 0개의 Point 에 대해 생성합니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const pointLogRepository = new PointLogRepository(runner.manager);
          const userId = '1';
          const reviewId = '1';
          const points = [];

          const result = pointLogRepository.createPointInstances(
            userId,
            reviewId,
            points,
          );

          expect(result.length).toEqual(0);
        },
        new Logger('test'),
      );
    });
  });
});
