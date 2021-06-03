import { safeToNumber } from '../utils';
import { SelectedTimeType } from '../types';

export const useConvertTime = (date: SelectedTimeType): SelectedTimeType => {
  let chooseDays;

  if (Array.isArray(date)) {
    const [timeRange, chooseDay] = date;

    if (!Array.isArray(timeRange)) {
      return [[], chooseDays];
    }

    const [startTime, endTime] = timeRange;

    chooseDays = safeToNumber(chooseDay);
    const st = safeToNumber(startTime);
    const et = safeToNumber(endTime);

    const timeArr: number[] = [];
    st && (timeArr[0] = st);
    et && (timeArr[1] = et);

    return [timeArr, chooseDays];
  }

  return [[], chooseDays];
};
