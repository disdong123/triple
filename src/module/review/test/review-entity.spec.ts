import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { Point } from '@src/module/point/vo/point';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';

describe('ReviewEntity 테스트', () => {
  let entity: ReviewEntity;
  beforeEach(() => {
    entity = new ReviewEntity();
  });

  describe('getPointDiffContent 테스트', () => {
    it('작성되어있지 않던 content 를 작성합니다.', () => {
      entity.content = '한길';
      const prevContent = '';

      const result = entity.getPointDiffContent(prevContent);

      expect(result).toEqual(new Point(PointTypeEnum.CONTENT, 1));
    });

    it('작성했던 content 를 제거합니다.', () => {
      entity.content = '';
      const prevContent = '한길';

      const result = entity.getPointDiffContent(prevContent);

      expect(result).toEqual(new Point(PointTypeEnum.CONTENT, -1));
    });

    it('아무런 이벤트도 발생하지 않습니다.', () => {
      entity.content = '한길';
      const prevContent = '두길';

      const result = entity.getPointDiffContent(prevContent);

      expect(result).toBeNull();
    });

    it('아무런 이벤트도 발생하지 않습니다.', () => {
      entity.content = '';
      const prevContent = '   ';

      const result = entity.getPointDiffContent(prevContent);

      expect(result).toBeNull();
    });
  });

  describe('getPointDiffPhotos 테스트', () => {
    it('기존 photo 를 전부 삭제합니다.', () => {
      const photo1 = new PhotoEntity();
      const photo2 = new PhotoEntity();
      photo1.isDeleted = false;
      photo2.isDeleted = false;

      const prevPhotos = [photo1, photo2];
      entity.photos = [];

      const result = entity.getPointDiffPhotos(prevPhotos);

      expect(result).toEqual(new Point(PointTypeEnum.PHOTO, -1));
    });

    it('photo 를 작성합니다.', () => {
      const photo1 = new PhotoEntity();
      const photo2 = new PhotoEntity();
      photo1.isDeleted = false;
      photo2.isDeleted = false;

      entity.photos = [photo1, photo2];
      const prevPhotos = [];

      const result = entity.getPointDiffPhotos(prevPhotos);

      expect(result).toEqual(new Point(PointTypeEnum.PHOTO, 1));
    });

    it('아무런 이벤트도 발생하지 않습니다.', () => {
      const prevPhotos = [];
      entity.photos = [];

      const result = entity.getPointDiffPhotos(prevPhotos);

      expect(result).toBeNull();
    });
  });

  describe('delete 테스트', () => {
    it('review 를 삭제하면 하위 photo 도 함께 삭제됩니다.', () => {
      const photo1 = new PhotoEntity();
      const photo2 = new PhotoEntity();
      photo1.isDeleted = false;
      photo2.isDeleted = false;

      entity.photos = [photo1, photo2];
      entity.isDeleted = false;

      entity.delete();

      expect(entity.isDeleted).toBeTruthy();
      expect(entity.photos).toEqual([{ isDeleted: true }, { isDeleted: true }]);
    });
  });

  describe('getTotalPoint 테스트', () => {
    it('review 에 대한 point 를 계산합니다.', () => {
      const points = [];
      for (let i = 1; i <= 10; i++) {
        const point = new PointLogEntity();
        point.point = i % 2 ? i : i * -1;
        points.push(point);
      }

      entity.pointLogs = points;

      const result = entity.getTotalPoint();

      expect(result).toEqual(-5);
    });
  });

  describe('classifyPhotoIds 테스트', () => {
    it('삭제할, 새로 생성할 혹은 수정할 photo 가 있는지 확인합니다.', () => {
      const ids = ['1', '2'];
      entity.photos = [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ] as PhotoEntity[];

      const { deleteIds, newIds, updateIds } = entity.classifyPhotoIds(ids);

      expect(updateIds.length).toEqual(2);
      expect(deleteIds.length).toEqual(0);
      expect(newIds.length).toEqual(0);
    });

    it('삭제할, 새로 생성할 혹은 수정할 photo 가 있는지 확인합니다.', () => {
      const ids = ['1', '2'];
      entity.photos = [
        {
          id: '1',
        },
        {
          id: '3',
        },
      ] as PhotoEntity[];

      const { deleteIds, newIds, updateIds } = entity.classifyPhotoIds(ids);

      expect(updateIds.length).toEqual(1);
      expect(deleteIds.length).toEqual(1);
      expect(newIds.length).toEqual(1);
    });
  });
});
