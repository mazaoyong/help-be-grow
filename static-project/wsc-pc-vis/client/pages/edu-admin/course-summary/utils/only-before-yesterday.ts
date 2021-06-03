import { endOfYesterday, isBefore } from 'date-fns';

export const YESTERDAY = endOfYesterday();
export function onlyBeforeYesterday(date: any) {
  return isBefore(date, YESTERDAY);
}
