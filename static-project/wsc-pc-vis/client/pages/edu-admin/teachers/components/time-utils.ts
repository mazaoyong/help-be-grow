import { startOfMonth, startOfWeek, endOfToday, endOfWeek, endOfMonth, format, addWeeks, addMonths, differenceInMonths, startOfToday, startOfDay, addDays, endOfDay, endOfYesterday } from 'date-fns';

export function getCurrentDay(): string[] {
  const startDate = formatDate(startOfToday());
  const endDate = formatDate(endOfToday());
  return [startDate, endDate];
}

export function getTomorrow(): string[] {
  const nowDays = new Date();
  const tomorrow = addDays(nowDays, 1);
  const startDate = formatDate(startOfDay(tomorrow));
  const endDate = formatDate(endOfDay(tomorrow));
  return [startDate, endDate];
}

// 因为上课记录是T+1的数据，所以时间最大范围为昨天，课表为实时数据，所以最大到今天
export function getCurrentMonth(endOfYtd = true): string[] {
  const nowDays = new Date();
  const startDate = formatDate(startOfMonth(nowDays));
  const endDate = formatDate(endOfYtd ? endOfYesterday() : endOfToday());
  return [startDate, endDate];
}

export function getLastMonth(): string[] {
  const nowDays = new Date();
  const lastMonthDay = addMonths(nowDays, -1);
  const startDate = formatDate(startOfMonth(lastMonthDay));
  const endDate = formatDate(endOfMonth(lastMonthDay));
  return [startDate, endDate];
}

export function getCurrentWeek(endOfYtd = true): string[] {
  const nowDays = new Date();
  const startDate = formatDate(startOfWeek(nowDays));
  const endDate = formatDate(endOfYtd ? endOfYesterday() : endOfWeek(nowDays));
  return [startDate, endDate];
}

export function getLastWeek(): string[] {
  const nowDays = new Date();
  const lastWeekDay = addWeeks(nowDays, -1);
  const startDate = formatDate(startOfWeek(lastWeekDay));
  const endDate = formatDate(endOfWeek(lastWeekDay));
  return [startDate, endDate];
}

export const validDateRange = (dateRange?: string[]): string => {
  if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
    return '请选择开始时间和结束时间';
  } else {
    const startTime = new Date(dateRange[0]);
    const endTime = new Date(dateRange[1]);
    const monthDiff = differenceInMonths(startTime, endTime);
    if (Math.abs(monthDiff) >= 3) {
      return '开始时间和结束时间不得超过三个月';
    } else {
      return '';
    }
  }
};

function formatDate(tDate: Date) : string {
  return format(tDate, 'YYYY-MM-DD HH:mm:ss');
}
