import { Injectable, Logger } from '@nestjs/common';
import { UserReviewPointResponse } from '@src/module/user/dto/user-review-point.response';
import { UserRepository } from '@src/module/user/repositories/user.repository';

/**
 *
 */
@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 유저가 작성한 review 의 총 point 를 계산합니다.
   * @param userId
   */
  async getTotalPointOnReview(
    userId: string,
  ): Promise<UserReviewPointResponse> {
    this.logger.debug(`getTotalPointOnReview(userId: ${userId}`);

    const user = await this.userRepository.getTotalPointOnReview(userId);

    this.logger.debug(`user: ${JSON.stringify(user)}`);

    return user?.toUserReviewPointResponse() || { totalPoint: 0 };
  }
}
