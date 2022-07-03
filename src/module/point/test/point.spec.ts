import { Point } from '@src/module/point/vo/point';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { ReviewEntity } from '@src/module/review/entities/review.entity';

describe('Point 테스트', () => {
  describe('getPhotoCreatedPoint 테스트', () => {
    it('[1, 2, 3] 이면 point 가 증가합니다.', () => {
      const photoIds = ['1', '2', '3'];

      const result = Point.getPhotoCreatedPoint(photoIds);

      expect(result.value).toEqual(1);
      expect(result.type).toEqual(PointTypeEnum.PHOTO);
    });

    it('[] 이면 point 가 증가하지 않습니다.', () => {
      const photoIds = [];

      const result = Point.getPhotoCreatedPoint(photoIds);

      expect(result).toBeNull();
    });
  });

  describe('getBonusPoint 테스트', () => {
    it('exReview 가 있으면 증가하지 않습니다.', () => {
      const exReview = new ReviewEntity();
      exReview.id = '1';

      const result = Point.getBonusPoint(exReview);

      expect(result).toBeNull();
    });

    it('exReview 가 없으면 증가합니다.', () => {
      const exReview = null;

      const result = Point.getBonusPoint(exReview);

      expect(result.value).toEqual(1);
      expect(result.type).toEqual(PointTypeEnum.BONUS);
    });
  });

  describe('getContentPoint 테스트', () => {
    it('content 가 "" 면 증가하지 않습니다.', () => {
      const content = '';

      const result = Point.getContentPoint(content);

      expect(result).toBeNull();
    });

    it('content 가 "hello" 면 증가합니다.', () => {
      const content = 'hello';

      const result = Point.getContentPoint(content);

      expect(result.value).toEqual(1);
      expect(result.type).toEqual(PointTypeEnum.CONTENT);
    });

    it('content 가 "      hello" 면 증가합니다.', () => {
      const content = '      hello';

      const result = Point.getContentPoint(content);

      expect(result.value).toEqual(1);
      expect(result.type).toEqual(PointTypeEnum.CONTENT);
    });

    it('content 가 "       " 면 증가하지 않습니다.', () => {
      const content = '          ';

      const result = Point.getContentPoint(content);

      expect(result).toBeNull();
    });
  });
});
