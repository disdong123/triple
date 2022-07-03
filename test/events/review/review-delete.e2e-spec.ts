import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { getManager } from 'typeorm';
import { DataService } from '@src/common/typeorm/seed-data.service';
import { DbName } from '@src/core/mysql/db-name';
import { ReviewResponse } from '@src/module/review/dto/review.response';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataService: DataService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataService = new DataService(getManager(DbName.EX));
  });

  describe('/events (POST) DELETE 테스트', () => {
    beforeEach(async () => {
      await dataService.clear();
      await dataService.createAppE2EData();
    });

    it('기존 사진은 모두 삭제, 새로운 사진을 넣습니다. content 는 빈배열을 넣습니다.', async () => {
      const data1 = {
        type: 'REVIEW',
        action: 'ADD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '좋아요!',
        attachedPhotoIds: [
          '965e5409-07a5-4204-ad3c-50651cd1250c',
          'b67b5fb6-8fde-44e0-a791-b991f0365e55',
        ],
        userId: 'f4902e09-2609-4087-a18e-38f9e15495c2',
        placeId: '0d9b0c6c-3df6-48e4-9fba-6708e2c35a51',
      };
      const data2 = {
        type: 'REVIEW',
        action: 'DELETE',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        userId: 'f4902e09-2609-4087-a18e-38f9e15495c2',
        placeId: '0d9b0c6c-3df6-48e4-9fba-6708e2c35a51',
      };

      const { body: body1 } = await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data1)
        .expect(201);

      const { body: body2 } = await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data2)
        .expect(201);

      expect((body1 as ReviewResponse).id).toEqual(
        'ddbb8085-760c-440e-9137-1680bc520b88',
      );
      expect((body1 as ReviewResponse).photos.length).toEqual(2);
      expect((body1 as ReviewResponse).content).toEqual('좋아요!');
      expect((body1 as ReviewResponse).totalPoint).toEqual(3);

      expect(body2).toBeTruthy();
    }, 10000);
  });
});
