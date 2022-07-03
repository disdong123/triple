import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

/**
 *
 * @constructor
 */
export function DayjsTransformer() {
  const toPlain = Transform(
    (obj) => {
      return (obj.value as unknown as dayjs.Dayjs).toISOString();
    },
    {
      toPlainOnly: true,
    },
  );

  const toClass = Transform(
    (obj) => {
      return dayjs(obj.value as unknown as string);
    },
    {
      toClassOnly: true,
    },
  );

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}

// value = {
//   value: '2022-06-01',
//     key: 'startAt',
//     obj: {
//     name: '마쯔리',
//       country: 'JAPAN',
//       startAt: '2022-06-01',
//       endAt: '2022-06-02'
//   },
//   type: 0,
//     options: {
//     enableCircularCheck: false,
//       enableImplicitConversion: true,
//       excludeExtraneousValues: false,
//       excludePrefixes: undefined,
//       exposeDefaultValues: false,
//       exposeUnsetFields: true,
//       groups: undefined,
//       ignoreDecorators: false,
//       strategy: undefined,
//       targetMaps: undefined,
//       version: undefined
//   }
// }
