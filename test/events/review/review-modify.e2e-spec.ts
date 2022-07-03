import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { getManager } from 'typeorm';
import { DataService } from '@src/common/typeorm/seed-data.service';
import { DbName } from '@src/core/mysql/db-name';
import { ReviewResponse } from '@src/module/review/dto/review.response';

describe('Review (e2e)', () => {
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

  describe('/events (POST) MODIFY 테스트', () => {
    beforeEach(async () => {
      await dataService.clear();
      await dataService.createAppE2EData();
    });

    it('기존 사진은 모두 삭제, 새로운 사진을 넣습니다. content 는 빈 배열을 넣습니다.', async () => {
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
        action: 'MOD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '',
        attachedPhotoIds: [
          'c1029296-1ce0-49bf-9fac-6476820181fb',
          'dd77cefc-7ddc-4cf5-a61c-5a09b4e01fb9',
          'fa87bb80-39d2-4da6-857e-f89d2ab0efb9',
        ],
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

      expect((body2 as ReviewResponse).id).toEqual(
        'ddbb8085-760c-440e-9137-1680bc520b88',
      );
      expect((body2 as ReviewResponse).photos.length).toEqual(3);
      expect((body2 as ReviewResponse).content).toEqual('');
      expect((body2 as ReviewResponse).totalPoint).toEqual(2);
    }, 10000);

    it('일부 사진은 삭제, 일부 사진은 추가합니다.', async () => {
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
        action: 'MOD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '좋아요!',
        attachedPhotoIds: [
          '965e5409-07a5-4204-ad3c-50651cd1250c',
          'fa87bb80-39d2-4da6-857e-f89d2ab0efb9',
        ],
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
      expect((body1 as ReviewResponse).photos.map((p) => p.id)).toEqual([
        '965e5409-07a5-4204-ad3c-50651cd1250c',
        'b67b5fb6-8fde-44e0-a791-b991f0365e55',
      ]);
      expect((body1 as ReviewResponse).totalPoint).toEqual(3);

      expect((body2 as ReviewResponse).id).toEqual(
        'ddbb8085-760c-440e-9137-1680bc520b88',
      );
      expect((body2 as ReviewResponse).photos.map((p) => p.id)).toEqual([
        '965e5409-07a5-4204-ad3c-50651cd1250c',
        'fa87bb80-39d2-4da6-857e-f89d2ab0efb9',
      ]);
      expect((body2 as ReviewResponse).totalPoint).toEqual(3);
    }, 10000);

    it('모든 사진을 삭제합니다.', async () => {
      // 5.삭제
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
        action: 'MOD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '좋아요!',
        attachedPhotoIds: [],
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
      expect((body1 as ReviewResponse).photos.map((p) => p.id)).toEqual([
        '965e5409-07a5-4204-ad3c-50651cd1250c',
        'b67b5fb6-8fde-44e0-a791-b991f0365e55',
      ]);
      expect((body1 as ReviewResponse).totalPoint).toEqual(3);

      expect((body2 as ReviewResponse).id).toEqual(
        'ddbb8085-760c-440e-9137-1680bc520b88',
      );
      expect((body2 as ReviewResponse).photos).toEqual([]);
      expect((body2 as ReviewResponse).totalPoint).toEqual(2);
    }, 10000);

    it('글과 사진이 없는 상태에서 추가합니다.', async () => {
      const data1 = {
        type: 'REVIEW',
        action: 'ADD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '',
        attachedPhotoIds: [],
        userId: 'f4902e09-2609-4087-a18e-38f9e15495c2',
        placeId: '0d9b0c6c-3df6-48e4-9fba-6708e2c35a51',
      };
      const data2 = {
        type: 'REVIEW',
        action: 'MOD',
        reviewId: 'ddbb8085-760c-440e-9137-1680bc520b88',
        content: '좋아요!',
        attachedPhotoIds: [
          '965e5409-07a5-4204-ad3c-50651cd1250c',
          'b67b5fb6-8fde-44e0-a791-b991f0365e55',
        ],
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
      expect((body1 as ReviewResponse).photos.map((p) => p.id)).toEqual([]);
      expect((body1 as ReviewResponse).totalPoint).toEqual(1);

      expect((body2 as ReviewResponse).id).toEqual(
        'ddbb8085-760c-440e-9137-1680bc520b88',
      );
      expect((body2 as ReviewResponse).photos.map((p) => p.id)).toEqual([
        '965e5409-07a5-4204-ad3c-50651cd1250c',
        'b67b5fb6-8fde-44e0-a791-b991f0365e55',
      ]);
      expect((body2 as ReviewResponse).totalPoint).toEqual(3);
    }, 10000);
  });
});
