import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventTypeEnum } from '@src/module/event/enums/event-type.enum';
import { ReviewResponse } from '@src/module/review/dto/review.response';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventBody } from '@src/module/event/dto/event.body';
import { EventUtil } from '@src/module/event/event.util';
import { ReviewHelper } from '@src/module/review/review.helper';

@ApiTags('Events')
@Controller('events')
export class EventController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly reviewHelper: ReviewHelper) {}

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
    examples: EventUtil.handleEventsExamples,
  })
  @Post()
  handleEvents(
    @Body() eventBody: EventBody,
  ): Promise<ReviewResponse | boolean> {
    this.logger.debug(`eventBody: ${eventBody.toString()}`);

    switch (eventBody.type) {
      case EventTypeEnum.REVIEW:
        return this.reviewHelper.get(eventBody);
    }
  }
}
