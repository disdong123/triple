import { HttpStatus } from '@nestjs/common';

/**
 *
 */
export abstract class CustomResponse {
  statusCode: number;
  message: string;

  protected constructor(statusCode: HttpStatus, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 *
 */
export class ResponseSucceed<ResponseData> extends CustomResponse {
  readonly data?: ResponseData;

  constructor(
    data?: ResponseData,
    message = 'OK',
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(statusCode, message);
    this.data = data;
  }
}

/**
 *
 */
export class ResponseError extends CustomResponse {
  path: string;

  datetime: string;

  constructor(
    statusCode: HttpStatus,
    message: string,
    path: string,
    datetime: string,
  ) {
    super(statusCode, message);
    this.path = path;
    this.datetime = datetime;
  }
}
