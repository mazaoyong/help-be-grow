import DateUtil from '@youzan/utils/date';
import { IProviderProps, DispatchType } from '../../store';
import { formatQuery } from '../../format';
import { getScheduleViewAPI } from '../../../../api';
import { setQuery } from '../../../../utils/query';
import { Notify } from 'zent';
import cloneDeep from 'lodash/cloneDeep';
import YZLocalStorage from 'zan-utils/local_storage';
const { parseDate, travel, formatDate } = DateUtil;

const datePattern: string = 'YY-MM-DD HH:mm:ss';

export const isTimeOverlap: (data: any, latestDate: string, startTime: number, endTime: number) => boolean =
(data, latestDate, startTime, endTime) => {
  if (data[latestDate] && data[latestDate].length > 2) {
    let overlapNum: number = 0;
    data[latestDate].map(item => {
      if (item.endTime <= startTime || item.startTime >= endTime) {
        return item;
      } else {
        overlapNum++;
        return item;
      }
    });
    if (overlapNum > 2) {
      return true;
    }
  }

  return false;
};

const GotoPage: (submitData: any, store: IProviderProps['state'], dispatch: DispatchType, scheduleId: string) => void = (submitData, store, dispatch, scheduleId) => {
  let startTime: Date = new Date();
  let endTime: Date = new Date();
  let startDate: string = '';
  if (submitData) {
    const { repeatConfig = {}, eduCourseId = '' } = submitData;
    const { data, activeId, scheduleType } = store;

    // 重复时间pattern提取，解构。
    if (repeatConfig['noRepeatConfig']) { // 不重复排课
      startDate = repeatConfig['noRepeatConfig']['date'];
      startTime = parseDate(`${startDate} ${repeatConfig['noRepeatConfig']['startTime']}`, datePattern);
      endTime = parseDate(`${startDate} ${repeatConfig['noRepeatConfig']['endTime']}`, datePattern);
    } else if (repeatConfig['dayRepeatConfig']) { // 按天重复排课
      startDate = repeatConfig['dayRepeatConfig']['startDate'];
      startTime = parseDate(`${startDate} ${repeatConfig['dayRepeatConfig']['startTime']}`, datePattern);
      endTime = parseDate(`${startDate} ${repeatConfig['dayRepeatConfig']['endTime']}`, datePattern);
    } else if (repeatConfig['weekRepeatConfig']) { // 按周重复排课
      const { weekRepeatTimes } = repeatConfig['weekRepeatConfig'];
      const leadDay = parseDate(`${repeatConfig['weekRepeatConfig']['startDate']}`, 'YY-MM-DD');
      const leadWeekDay = leadDay.getDay();
      weekRepeatTimes.sort((day1, day2) => day1.weekDay - day2.weekDay);
      const dayDiff = weekRepeatTimes[0].weekDay >= leadWeekDay
        ? weekRepeatTimes[0].weekDay - leadWeekDay : weekRepeatTimes[0].weekDay - leadWeekDay + 7;
      startDate = formatDate(travel(dayDiff, leadDay), 'YYYY-MM-DD');
      startTime = parseDate(`${startDate} ${weekRepeatTimes[0]['startTime']}`, datePattern);
      endTime = parseDate(`${startDate} ${weekRepeatTimes[0]['endTime']}`, datePattern);
    } else {
      return;
    }

    if (!activeId) {
      YZLocalStorage.setItem('schedule_latest_info', JSON.stringify({ id: eduCourseId, startTime: startTime.getTime(), endTime: endTime.getTime(), scheduleId }));
      if (data[startDate]) { // 当前时间范围
        dispatch({ type: 'setFilter', value: { startTime, scheduleType: isTimeOverlap(data, startDate, startTime.getTime(), endTime.getTime()) ? 'day' : scheduleType } as any });
      } else { // 非当前时间范围
        const state = cloneDeep({ ...store, startTime: startTime });
        setQuery(state);
        const req = formatQuery(state);
        getScheduleViewAPI(req)
          .then((res = []) => {
            dispatch({ type: 'setFilter', value: { startTime, scheduleType: isTimeOverlap(res, startDate, startTime.getTime(), endTime.getTime()) ? 'day' : scheduleType } as any });
          })
          .catch(err => {
            dispatch({ type: 'loading', value: false });
            Notify.error(err);
          });
      }
    }
  }
};

export default GotoPage;
