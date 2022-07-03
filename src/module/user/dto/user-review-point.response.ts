import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 *
 */
export class UserReviewPointResponse {
  @IsNumber()
  @IsNotEmpty()
  totalPoint: number;
}
