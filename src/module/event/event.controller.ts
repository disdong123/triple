import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventActionEnum } from '@src/module/review/enums/event-action.enum';
import { ReviewService } from '@src/module/review/review.service';
import { EventTypeEnum } from '@src/module/review/enums/event-type.enum';
import { ReviewResponse } from '@src/module/review/dto/review.response';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventBody } from '@src/module/event/dto/event.body';

@ApiTags('Events')
@Controller('events')
export class EventController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly reviewService: ReviewService) {}

  /**
   *
   * @param eventBody
   */
  @ApiOperation({
    summary: 'event 를 위한 api',
  })
  @ApiBody({
    type: EventBody,
    description: 'event 를 위한 body 값입니다.',
    examples: {
      ADD: {
        value: {
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
        },
      },
      MOD: {
        value: {
          type: 'REVIEW',
          action: 'MOD',
          reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
          content: '좋습니다.!',
          attachedPhotoIds: [
            'c1029296-1ce0-49bf-9fac-6476820181fb',
            'dd77cefc-7ddc-4cf5-a61c-5a09b4e01fb9',
          ],
          userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
          placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
        },
      },
      DELETE: {
        value: {
          type: 'REVIEW',
          action: 'DELETE',
          reviewId: '1adc1726-7041-4f86-88d5-4bb7f31665bf',
          content: '',
          attachedPhotoIds: [],
          userId: '52a21165-1de2-4703-aa87-a06ed41cec69',
          placeId: 'a4a0cce2-e058-4e4c-abd6-251cb63d95ee',
        },
      },
    },
  })
  @Post()
  handleEvents(
    @Body() eventBody: EventBody,
  ): Promise<ReviewResponse | boolean> {
    this.logger.debug(`eventBody: ${eventBody.toString()}`);

    switch (eventBody.type) {
      case EventTypeEnum.REVIEW:
        // Todo. review 에 대해 controller 를 만들지 확인합니다.
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
}
