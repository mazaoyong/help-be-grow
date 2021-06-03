import { isNil } from 'lodash';
import {
  queriesMarshall,
  dropEasyListPageQueries,
  dropEmptyLikeValue,
  dropSelectAllValue,
  dropNotFullFilledTimeRange,
} from 'fns/format/queries-marshall';

const addonKeyPairs: Record<string, string[]> = {
  signinTime: ['startTime', 'endTime'],
  lessonTime: ['lessonStartTime', 'lessonEndTime'],
};
const timeRangeKeys = ['signinTime', 'lessonTime'];
const addonTimeList: string[] = ['00:00:00', '23:59:59'];
function outputTimeRangeFormatErr(_, key: string) {
  // 如果时间格式对不上，不能进行格式化操作，这个行为影响查询和导出
  const fieldName = {
    signinTime: '签到时间',
    lessonTime: '上课时间',
  }[key];
  throw Error(`${fieldName}日期格式不正确，请选择开始时间和结束时间`);
}
export const signinListQueryFormatter = (query: Record<string, any>) => {
  const finalQueries = queriesMarshall.queriesDropper(query, [
    isNil,
    dropEasyListPageQueries,
    dropEmptyLikeValue,
    dropSelectAllValue([
      'userId',
      'eduCourseId',
      'classId',
      'teacherId',
      'courseStatus',
      'signInStatus',
    ]),
    dropNotFullFilledTimeRange(timeRangeKeys, outputTimeRangeFormatErr),
  ]);
  if (Object.keys(finalQueries).length) {
    Object.entries(finalQueries).forEach(([key, value]) => {
      switch (key) {
        // 如果是时间类型
        case 'signinTime':
        case 'lessonTime': {
          const dateValue = (value as any[] | undefined) || [];
          const validDate = dateValue.filter(Boolean);
          addonKeyPairs[key].forEach((addonKey, valueIdx) => {
            // YYYY-MM-DD 00:00:00(23:59:59)
            finalQueries[addonKey] = `${validDate[valueIdx]} ${addonTimeList[valueIdx]}`;
          });
          delete finalQueries[key];
          break;
        }
        default:
          break;
      }
      if (Number(value)) {
        finalQueries[key] = Number(value);
      }
    });
  }
  return finalQueries;
};
