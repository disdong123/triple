import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PointTypeEnum } from '@src/module/point/enums/point-type.enum';

/**
 * pointLog 응답값
 */
export class PointLogResponse {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEnum(PointTypeEnum)
  type: PointTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  point: number;
}
