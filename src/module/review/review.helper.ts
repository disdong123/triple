import { Controller, Injectable } from '@nestjs/common';
import { EventActionEnum } from '@src/module/event/enums/event-action.enum';
import { ReviewService } from '@src/module/review/review.service';
import { EventBody } from '@src/module/event/dto/event.body';
import { ReviewResponse } from '@src/module/review/dto/review.response';

/**
 *
 */
@Injectable()
export class ReviewHelper {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * action 에 맞는 행위를 반환합니다.
   * @param eventBody
   */
  get(eventBody: EventBody): Promise<ReviewResponse | boolean> {
    switch (eventBody.action) {
      case EventActionEnum.ADD:
        return this.reviewService.add(
          eventBody.reviewId,
          eventBody.userId,
          eventBody.placeId,
          eventBody.content,
          eventBody.attachedPhotoIds,
        );
      case EventActionEnum.MOD:
        return this.reviewService.modify(
          eventBody.reviewId,
          eventBody.userId,
          eventBody.placeId,
          eventBody.content,
          eventBody.attachedPhotoIds,
        );
      case EventActionEnum.DELETE:
        return this.reviewService.delete(
          eventBody.reviewId,
          eventBody.userId,
          eventBody.placeId,
        );
    }
  }
}
