import * as dayjs from 'dayjs';
import { DeleteResult, FindOperator, UpdateResult } from 'typeorm';

/**
 *
 */
export const DateTimeTransformer = {
  to(time: dayjs.Dayjs | FindOperator<any>): string | FindOperator<any> {
    if (time instanceof FindOperator) {
      return time;
    }
    if (time) {
      return time.ymdhms();
    }
    return null;
  },
  from(value: string): dayjs.Dayjs {
    const dateTime = dayjs(value);
    if (dateTime.isValid()) {
      return dateTime;
    }
    return null;
  },
};
