import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 *
 */
export class PhotoResponse {
  @IsUUID('all')
  @IsNotEmpty()
  id: string;
}
