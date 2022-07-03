import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';
import { ReviewEntity } from '@src/module/review/entities/review.entity';

/**
 * 포인트 객체입니다. 포인트 유형과 증감할 포인트를 갖습니다.
 */
export class Point {
  constructor(
    private readonly _type: PointTypeEnum,
    private readonly _value = 0,
  ) {
    this._type = _type;
    this._value = _value;
  }

  get value(): number {
    return this._value;
  }

  get type(): PointTypeEnum {
    return this._type;
  }

  /**
   * photo 관련 포인트를 생성합니다.
   * @param ids
   */
  static getPhotoCreatedPoint(ids: string[]): Point | null {
    return ids.length ? new Point(PointTypeEnum.PHOTO, 1) : null;
  }

  /**
   * Bonus 관련 포인트를 생성합니다.
   * @param exReview
   */
  static getBonusPoint(exReview?: ReviewEntity): Point | null {
    if (!exReview) {
      return new Point(PointTypeEnum.BONUS, 1);
    }

    return null;
  }

  /**
   * content 관련 포인트를 생성합니다.
   * @param content
   */
  static getContentPoint(content: string): Point | null {
    if (content.trim().length) {
      return new Point(PointTypeEnum.CONTENT, 1);
    }

    return null;
  }
}
