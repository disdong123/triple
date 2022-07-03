import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
import { ResponseError } from '@src/common/filter/dto/custom-response';

/**
 * 잡히지 않은 예외를 잡습니다.
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(this.constructor.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error(exception?.message, exception?.stack);

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal Server Error',
      path: request.url,
      datetime: dayjs().format(),
    } as ResponseError);
    return;
  }
}
