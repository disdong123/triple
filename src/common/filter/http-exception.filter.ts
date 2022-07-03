import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
import { ResponseError } from '@src/common/filter/dto/custom-response';

/**
 * HttpException 관련 예외를 잡습니다.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(this.constructor.name);

  /**
   *
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost): any {
    this.logger.error(exception.message, exception.stack);

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    // http exception 이 아닐경우, 500 error 로 변환후 반환합니다.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      path: request.url,
      datetime: dayjs().format(),
    } as ResponseError);
    return;
  }
}
