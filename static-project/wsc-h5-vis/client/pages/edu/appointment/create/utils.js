import isSameDay from 'date-fns/is_same_day';
import isSameMonth from 'date-fns/is_same_month';
import isSameYear from 'date-fns/is_same_year';

export const isSameDate = (d1, d2) => {
  return isSameDay(d1, d2) && isSameMonth(d1, d2) && isSameYear(d1, d2);
};
