import { EventTypeEnum } from '@src/module/event/enums/event-type.enum';
import { EventActionEnum } from '@src/module/event/enums/event-action.enum';
import { IsEnum, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

/**
 * post /events 의 body 값입니다.
 */
export class EventBody {
  @IsEnum(EventTypeEnum)
  @IsNotEmpty()
  type: EventTypeEnum;

  @IsEnum(EventActionEnum)
  @IsNotEmpty()
  action: EventActionEnum;

  @IsUUID('all', { message: () => `userId must be UUID` })
  @IsNotEmpty()
  userId: string;

  @IsUUID('all', { message: () => `placeId must be UUID` })
  @IsNotEmpty()
  placeId: string;

  @IsUUID('all', { message: () => `placeId must be UUID` })
  @IsNotEmpty()
  reviewId: string;

  // 필요하지 않는 경우에는 '' 로 들어옵니다.
  @IsString()
  @Length(0, 255)
  content: string;

  // 필요하지 않는 경우에는 [] 로 들어옵니다.
  @IsUUID('all', { each: true })
  attachedPhotoIds: string[];

  /**
   *
   */
  toString(): string {
    return JSON.stringify(this);
  }
}
