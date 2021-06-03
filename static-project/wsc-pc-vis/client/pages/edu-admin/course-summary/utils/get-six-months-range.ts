import { subDays, differenceInDays } from 'date-fns';

const yesterday = subDays(Date.now(), 1);
// 6个月粗略按照180天计算
const MAX_SEARCH_DAYS = 180;
export const timeRange = [subDays(yesterday, MAX_SEARCH_DAYS), yesterday];
export const isInSixMonths = (newRange: any[] | undefined): boolean => {
  if (!newRange) return true;
  const validateTime = newRange.filter(Boolean);
  if (validateTime.length === 0) return true;
  return Math.abs(differenceInDays(validateTime[0], validateTime[1])) <= MAX_SEARCH_DAYS;
};
