import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { EventBody } from '@src/module/event/dto/event.body';

/**
 * 다른 validation 이 필요할 시에 사용합니다.
 */
@Injectable()
export class EventBodyPipe implements PipeTransform {
  private readonly logger = new Logger(this.constructor.name);
  /**
   *
   * @param value
   * @param metadata
   */
  transform(value: EventBody, metadata: ArgumentMetadata) {
    this.logger.debug(`value: ${value.toString()}`);
    if (!value) {
      return value;
    }
  }
}
