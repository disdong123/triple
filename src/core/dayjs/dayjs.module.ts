import { Logger, Module, OnModuleInit } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

declare module 'dayjs' {
  interface Dayjs {
    ymd(): string;
    ymdhms(): string;
  }
}

const utils: dayjs.PluginFunc = (option, dayjsClass) => {
  dayjsClass.prototype.ymd = function () {
    return this.format('YYYY-MM-DD');
  };

  dayjsClass.prototype.ymdhms = function () {
    return this.format('YYYY-MM-DD HH:mm:ss');
  };
};

@Module({})
export class DayjsModule implements OnModuleInit {
  private readonly logger: Logger = new Logger(this.constructor.name);
  onModuleInit() {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(utils);
    dayjs.tz.setDefault('Asia/Seoul');
    this.logger.debug(
      `DayjsModule initialized: Set customParseFormat, utc, timezone`,
    );
  }
}
