import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';
import { UserEntity } from '@src/module/user/entities/user.entity';

describe('UserEntity 테스트', () => {
  let entity: UserEntity;
  beforeEach(() => {
    entity = new UserEntity();
  });

  describe('getTotalPointOnReview 테스트', () => {
    it('유저의 총 포인트를 계산합니다.', () => {
      const reviews = [new ReviewEntity(), new ReviewEntity()];

      const points = [];
      for (let i = 1; i <= 10; i++) {
        const point = new PointLogEntity();
        point.point = i % 2 ? i : i * -1;
        points.push(point);
      }

      reviews[0].pointLogs = points;
      reviews[1].pointLogs = points;

      entity.reviews = reviews;

      const result = entity.getTotalPointOnReview();

      expect(result).toEqual(-10);
    });
  });
});
