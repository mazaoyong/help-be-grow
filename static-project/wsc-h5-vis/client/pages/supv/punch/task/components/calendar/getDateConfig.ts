import { getDate, isSameDay, format, isBefore, subDays, addDays } from 'date-fns';
import { calendar } from '@youzan/zan-media-sdk';
import { IDayCell } from '@youzan/zan-media-sdk/lib/calendar/src/month';
const { getTimeRangeCalendar } = calendar as any;

type IDateLike = Date | string | number;
type IExtendDayCell = IDayCell & {
  dayNumber?: number;
  formatDate?: string;
};

const formatStr = 'YYYY-MM-DD';

export default function(startDate: IDateLike, endDate?: IDateLike) {
  const now: IDateLike = new Date();
  let currentEndDate: IDateLike = now;
  if (endDate) {
    currentEndDate = isBefore(endDate, now) ? now : endDate;
  }
  const weekList: IDayCell[][] = getTimeRangeCalendar(
    startDate,
    currentEndDate
  );
  const flattedDayList: IExtendDayCell[] = [];
  const earliestTimestamp = subDays(startDate, 3).getTime();
  const latestTimestamp = addDays(currentEndDate, 3).getTime();

  let currentIndex = -1;
  if (Array.isArray(weekList)) {
    weekList.forEach((dayList, weekOffset) => {
      if (Array.isArray(dayList)) {
        dayList.forEach((dayConf, index) => {
          const curTimestamp = dayConf.date.getTime();
          if (curTimestamp < earliestTimestamp || curTimestamp >= latestTimestamp) {
            // 最多显示开始前三天以及结束后三天
            return;
          }

          const week = (index + 1) % 7;
          dayConf.week = convertingWeekToChinese(week);
          dayConf.formatDate = format(dayConf.date, formatStr);

          const flattedDayItem: IExtendDayCell = Object.assign({}, dayConf);
          // 每个月几号
          flattedDayItem.dayNumber = getDate(dayConf.date);

          flattedDayList.push(flattedDayItem);

          if (isSameDay(dayConf.date, now)) {
            currentIndex = 7 * weekOffset + index;
          }
        });
      }
    });
  }

  return {
    list: flattedDayList,
    currentIndex,
  };
}

const WEEK_LIST = ['日', '一', '二', '三', '四', '五', '六'];
function convertingWeekToChinese(week: number): string {
  return WEEK_LIST[week] || '';
}
