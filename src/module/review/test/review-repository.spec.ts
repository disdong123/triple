import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewModule } from '@src/module/review/review.module';
import { CoreModule } from '@src/core/core.module';
import { TransactionService } from '@src/common/typeorm/transaction.service';
import { getManager, QueryRunner } from 'typeorm';
import { ReviewRepository } from '@src/module/review/repositories/review.repository';
import { DataService } from '@src/common/typeorm/seed-data.service';
import { DbName } from '@src/core/mysql/db-name';

describe('ReviewRepository 테스트', () => {
  let app: INestApplication;
  let transactionService: TransactionService;
  let dataService: DataService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ReviewModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    transactionService =
      moduleFixture.get<TransactionService>(TransactionService);

    dataService = new DataService(getManager(DbName.EX));
  }, 10000);

  beforeEach(async () => {
    await dataService.clear();
  });

  describe('userId, placeId unique 테스트', () => {
    it('userId, placeId 가 동일한 review 는 존재할 수 없습니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);
          const dataService = new DataService(runner.manager);

          await Promise.all([
            dataService.createUser(),
            dataService.createPlace(),
            dataService.createReview(),
          ]);

          const instance = reviewRepository.repository.create({
            id: 2,
            userId: 1,
            placeId: 1,
            content: 'hello',
          });
          await expect(
            reviewRepository.repository.save(instance),
          ).rejects.toThrow();
        },
        new Logger('test'),
      );
    });

    it('userId, placeId 가 동일하지 않은 review 는 존재할 수 있습니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);
          const dataService = new DataService(runner.manager);

          await Promise.all([
            dataService.createUser(),
            dataService.createPlace(),
            dataService.createReview(),
          ]);

          const instance = reviewRepository.repository.create({
            id: 2,
            userId: 1,
            placeId: 2,
            content: 'hello',
          });
          const entity = await reviewRepository.repository.save(instance);
          expect(entity.placeId).toEqual(2);
        },
        new Logger('test'),
      );
    });
  });

  describe('findByPlaceId 테스트', () => {
    it('장소에 한 개의 리뷰가 이미 존재합니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);
          const dataService = new DataService(runner.manager);

          await Promise.all([
            dataService.createUser(),
            dataService.createPlace(),
            dataService.createReview(),
            dataService.createPhoto(),
          ]);

          const result = await reviewRepository.findByPlaceId('1');

          expect(result.id).toEqual('1');
        },
        new Logger('test'),
      );
    });

    it('장소에 리뷰가 없습니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);

          const result = await reviewRepository.findByPlaceId('1');

          expect(result).toBeUndefined();
        },
        new Logger('test'),
      );
    });

    it('장소에 삭제된 리뷰만 있습니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);
          const dataService = new DataService(runner.manager);

          await Promise.all([
            dataService.createUser(),
            dataService.createPlace(),
            dataService.createDeletedReview(),
            dataService.createPhoto(),
          ]);

          const result = await reviewRepository.findByPlaceId('1');

          expect(result).toBeUndefined();
        },
        new Logger('test'),
      );
    });

    it('장소에 삭제된 리뷰 1개, 실제 리뷰 1개 있습니다.', async () => {
      await transactionService.transactionCBTest(
        async (runner: QueryRunner) => {
          const reviewRepository = new ReviewRepository(runner.manager);
          const dataService = new DataService(runner.manager);

          await Promise.all([
            dataService.createUser(),
            dataService.createPlace(),
            dataService.createDeletedReview(2),
            dataService.createReview(),
            dataService.createPhoto(),
          ]);

          const result = await reviewRepository.findByPlaceId('1');

          expect(result.id).toEqual('1');
        },
        new Logger('test'),
      );
    });
  });
});
