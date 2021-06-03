import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

export function formatBirthday(timestamp) {
  if (timestamp === '') {
    return '';
  }
  const months = differenceInCalendarMonths(Date.now(), timestamp);
  if (months === 0) {
    const days = differenceInCalendarDays(Date.now(), timestamp);
    return days + '天';
  }
  if (months < 12) {
    return months + '个月';
  }
  return Math.ceil(months / 12) + '岁';
}
