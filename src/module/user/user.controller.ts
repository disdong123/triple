import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UserService } from '@src/module/user/user.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

/**
 *
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userService: UserService) {}

  /**
   * 유저가 작성한 review 의 총 point 를 계산합니다.
   * @param id
   */
  @ApiOperation({
    summary: '유저가 작성한 review 의 총 포인트 합산을 구합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '유저가 작성한 review 의 총 포인트 합산을 구합니다.',
  })
  @Get(':id/review/points')
  getTotalPointOnReview(@Param('id') id: string) {
    this.logger.debug(`getTotalPointOnReview(id: ${id}`);
    return this.userService.getTotalPointOnReview(id);
  }
}
