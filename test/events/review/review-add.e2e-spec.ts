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

  describe('/events (POST) ADD 테스트', () => {
    beforeEach(async () => {
      await dataService.clear();
      await dataService.createAppE2EData();
    });

    it('정상적으로 추가합니다.', async () => {
      const data1 = {
        type: 'REVIEW',
        action: 'ADD',
        reviewId: '1',
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
        action: 'ADD',
        reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
        content: '좋습니다.!',
        attachedPhotoIds: [
          'c1029296-1ce0-49bf-9fac-6476820181fb',
          'dd77cefc-7ddc-4cf5-a61c-5a09b4e01fb9',
          'fa87bb80-39d2-4da6-857e-f89d2ab0efb9',
        ],
        userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
        placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
      };

      await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data2)
        .expect(201);
    }, 10000);

    it('userId, placeId 가 동일한 review 는 생성되지 않습니다.', async () => {
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
        action: 'ADD',
        reviewId: '50aaf754-ed17-476a-b71e-8f2bfc83afee',
        content: '좋습니다.!',
        attachedPhotoIds: [],
        userId: 'f4902e09-2609-4087-a18e-38f9e15495c2',
        placeId: '0d9b0c6c-3df6-48e4-9fba-6708e2c35a51',
      };

      await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/events')
        .type('application/json')
        .send(data2)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    }, 10000);
  });
});

//
//
// // 7. 삭제
// {
//   "type": "REVIEW",
//   "action": "ADD",
//   "reviewId": "ddbb8085-760c-440e-9137-1680bc520b88",
//   "content": "",
//   "attachedPhotoIds": ["965e5409-07a5-4204-ad3c-50651cd1250c", "b67b5fb6-8fde-44e0-a791-b991f0365e55"],
//   "userId": "f4902e09-2609-4087-a18e-38f9e15495c2",
//   "placeId": "0d9b0c6c-3df6-48e4-9fba-6708e2c35a51"
// },
// {
//   "type": "REVIEW",
//   "action": "DELETE",
//   "reviewId": "ddbb8085-760c-440e-9137-1680bc520b88",
//   "content": "좋아요!",
//   "attachedPhotoIds": ["965e5409-07a5-4204-ad3c-50651cd1250c", "b67b5fb6-8fde-44e0-a791-b991f0365e55"],
//   "userId": "f4902e09-2609-4087-a18e-38f9e15495c2",
//   "placeId": "0d9b0c6c-3df6-48e4-9fba-6708e2c35a51"
// },

// INSERT INTO user(id, name) VALUES('f4902e09-2609-4087-a18e-38f9e15495c2', '한길');
// INSERT INTO user(id, name) VALUES('52a21165-1de2-4703-aa87-a06ed41cec69', '두길');
// INSERT INTO user(id, name) VALUES('1c8d2591-83d6-4d26-96b3-260183e3010e', '세길');
// INSERT INTO user(id, name) VALUES('14d231c3-797c-4b35-bcc1-ebb8b73f9fe2', '네길');
// INSERT INTO user(id, name) VALUES('bc965dc3-fd2b-4257-8fc1-53d22ca7fe7a', '오길');
//
// INSERT INTO place(id, name) VALUES('0d9b0c6c-3df6-48e4-9fba-6708e2c35a51', '서울');
// INSERT INTO place(id, name) VALUES('a4a0cce2-e058-4e4c-abd6-251cb63d95ee', '부산');
// INSERT INTO place(id, name) VALUES('dcc50084-78b9-49ae-a370-5c285e70ff30', '대구');
// INSERT INTO place(id, name) VALUES('0d5e2327-09a7-402d-9b12-f518263d7f05', '울산');
// INSERT INTO place(id, name) VALUES('14d748df-2847-4304-b90c-21a15b5226f7', '경기');
