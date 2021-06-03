import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months';
import differenceInCalendarYear from 'date-fns/difference_in_calendar_years';
import endOfMonth from 'date-fns/end_of_month';
import startOfMonth from 'date-fns/start_of_month';
import subDays from 'date-fns/sub_days';
import getDays from 'date-fns/get_days_in_month';

export default function getAge(date) {
  const now = new Date();
  const year = differenceInCalendarYear(now, date);
  const month = differenceInCalendarMonths(now, date) - 1;
  const days = differenceInCalendarDays(now, date);
  const preMonthDays = getDays(endOfMonth(subDays(startOfMonth(date), 1)));

  if (days >= 365 && year > 0) {
    return year;
  }
  if (month > 0) {
    return `${month}个月`;
  }
  if (days > preMonthDays) {
    return '1个月';
  }
  return `${days}天`;
}
