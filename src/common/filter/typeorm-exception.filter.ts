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
import { QueryFailedError } from 'typeorm';
import { TypeORMError } from 'typeorm/error/TypeORMError';

/**
 * TypeORM 관련 예외를 캐치합니다.
 */
@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(this.constructor.name);

  /**
   *
   * @param exception
   * @param host
   */
  catch(exception, host: ArgumentsHost): any {
    this.logger.error(exception.message, exception.stack);

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Todo. Error 클래스에 따라 혹은 에러 코드에 따라 로깅을 달리할지 정해야합니다.
    if (exception instanceof QueryFailedError) {
      this.logger.error(
        `UNIQUE 제약조건 위반, 외래키 정합성 위반, 신텍스 에러 등 여러 부분에서 문제가 발생할 수 있습니다.`,
      );
      response.status(status).json({
        statusCode: status,
        message: `쿼리를 실행할 때 에러가 발생했습니다. 로그를 확인해주세요. code: ${exception['code']}`,
        path: request.url,
        datetime: dayjs().format(),
      } as ResponseError);
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      path: request.url,
      datetime: dayjs().format(),
    } as ResponseError);
    return;
  }
}
