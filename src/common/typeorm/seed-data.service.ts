import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

/**
 * 테스트용 데이터입니다. 실제 로직에 사용되지 않습니다.
 */
export class DataService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  createUser() {
    const str1 = `INSERT INTO user(id, name)
                  values ('1', '하나')`;
    const str2 = `INSERT INTO user(id, name)
                  values ('2', '두울')`;
    return Promise.all([
      this.entityManager.query(str1),
      this.entityManager.query(str2),
    ]);
  }

  createPlace() {
    const str1 = `INSERT INTO place(id, name)
                  values ('1', '서울')`;
    const str2 = `INSERT INTO place(id, name)
                  values ('2', '부산')`;
    return Promise.all([
      this.entityManager.query(str1),
      this.entityManager.query(str2),
    ]);
  }

  createReview() {
    const str1 = `INSERT INTO review(id, user_id, place_id, content)
                  values ('1', '1', '1', '안녕')`;
    return Promise.all([this.entityManager.query(str1)]);
  }

  createDeletedReview(id = 1) {
    const str1 = `INSERT INTO review(id, user_id, place_id, content, is_deleted)
                  values (?, '1', '2', '안녕', true)`;
    return Promise.all([this.entityManager.query(str1, [id])]);
  }

  createPhoto() {
    const str1 = `INSERT INTO photo(id, user_id, review_id)
                  values ('1', '1', '1')`;
    return Promise.all([this.entityManager.query(str1)]);
  }

  /**
   *
   */
  createAppE2EData() {
    this.entityManager.query(
      `INSERT INTO user(id, name) VALUES('f4902e09-2609-4087-a18e-38f9e15495c2', '하나')`,
    );
    this.entityManager.query(
      `INSERT INTO user(id, name) VALUES('52a21165-1de2-4703-aa87-a06ed41cec69', '두울')`,
    );

    this.entityManager.query(
      `INSERT INTO place(id, name) VALUES('0d9b0c6c-3df6-48e4-9fba-6708e2c35a51', '서울')`,
    );
    this.entityManager.query(
      `INSERT INTO place(id, name) VALUES('a4a0cce2-e058-4e4c-abd6-251cb63d95ee', '부산')`,
    );
  }

  /**
   *
   */
  async clear() {
    await this.entityManager.query(`DELETE FROM photo`);
    await this.entityManager.query(`DELETE FROM point_log`);
    await this.entityManager.query(`DELETE FROM review`);
    await this.entityManager.query(`DELETE FROM user`);
    await this.entityManager.query(`DELETE FROM place`);
  }

  /**
   *
   */
  async init() {
    // await this.clear();
    await Promise.all([
      this.entityManager.query(
        `INSERT INTO user(id, name) VALUES('f4902e09-2609-4087-a18e-38f9e15495c2', '하나')`,
      ),
      this.entityManager.query(
        `INSERT INTO user(id, name) VALUES('52a21165-1de2-4703-aa87-a06ed41cec69', '두울')`,
      ),
      this.entityManager.query(
        `INSERT INTO user(id, name) VALUES('1c8d2591-83d6-4d26-96b3-260183e3010e', '세엣')`,
      ),
      this.entityManager.query(
        `INSERT INTO user(id, name) VALUES('14d231c3-797c-4b35-bcc1-ebb8b73f9fe2', '네엣')`,
      ),
      this.entityManager.query(
        `INSERT INTO user(id, name) VALUES('bc965dc3-fd2b-4257-8fc1-53d22ca7fe7a', '다섯')`,
      ),

      this.entityManager.query(
        `INSERT INTO place(id, name) VALUES('0d9b0c6c-3df6-48e4-9fba-6708e2c35a51', '서울')`,
      ),
      this.entityManager.query(
        `INSERT INTO place(id, name) VALUES('a4a0cce2-e058-4e4c-abd6-251cb63d95ee', '부산')`,
      ),
      this.entityManager.query(
        `    INSERT INTO place(id, name) VALUES('dcc50084-78b9-49ae-a370-5c285e70ff30', '대구');
    `,
      ),
      this.entityManager.query(
        `INSERT INTO place(id, name) VALUES('0d5e2327-09a7-402d-9b12-f518263d7f05', '울산');`,
      ),
      this.entityManager.query(
        `INSERT INTO place(id, name) VALUES('14d748df-2847-4304-b90c-21a15b5226f7', '경기');`,
      ),
    ]);
  }
}
