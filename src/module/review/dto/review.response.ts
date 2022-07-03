import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { PointLogResponse } from '@src/module/point/dto/point-log.response';
import { PhotoResponse } from '@src/module/photo/dto/photo.response';

/**
 * review 응답값입니다.
 */
export class ReviewResponse {
  @IsUUID('all')
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @Type(() => PointLogResponse)
  @IsOptional()
  pointLogs?: PointLogResponse[];

  @Type(() => PhotoResponse)
  @IsOptional()
  photos?: PhotoResponse[];

  @Type(() => dayjs)
  createdAt: dayjs.Dayjs;

  @Type(() => dayjs)
  updatedAt: dayjs.Dayjs;

  @IsNumber()
  @IsNotEmpty()
  totalPoint: number;
}
