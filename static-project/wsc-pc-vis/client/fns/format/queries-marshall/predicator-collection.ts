export function dropEmptyLikeValue(value: any) {
  return value === '' || value === undefined || value === null;
}

function getSelectValue(ebizSelectList: string[], value: any, key: string) {
  const isEbizSelector = ebizSelectList.includes(key);
  if (isEbizSelector) {
    if (Array.isArray(value)) return value[0];
    return value;
  }
  return null;
}

/**
 * 如果值为`all`，应该被舍弃掉
 */
export function dropSelectAllValue(keyList: string[]) {
  return function temp(value: any, key: string) {
    const convertValue = getSelectValue(keyList, value, key);
    return convertValue === 'all';
  };
}

const specificKeys = ['page', 'pageSize'];
export function dropEasyListPageQueries(_: any, key: string) {
  return specificKeys.includes(key);
}

/**
 * 摊平ebiz-components/select的数据，通过设置`keyList`将所有可能是`ebiz-select`的数组数据平铺
 */
export function flatEbizSelectValue(keyList: string[]) {
  return function flatValue(value: any, key: string) {
    if (keyList.includes(key)) {
      if (Array.isArray(value)) return value[0];
    }
    return value;
  };
}

function defaultTimeRangePredicator(v: any[]) {
  return v.every(dropEmptyLikeValue);
}
function timeRangeBasePredicator(
  checkList: string[],
  predicator?: (value: any[], key: any) => boolean,
  fail?: (value: any, key: string) => void,
) {
  const furtherPredicator = predicator || defaultTimeRangePredicator;
  return function innerPredicator(timeRange: any[], targetKey: string) {
    if (checkList.includes(targetKey) && Array.isArray(timeRange)) {
      const filterTimeRange = timeRange.filter(Boolean);
      const isEmptyList = filterTimeRange.length === 0;
      const isInvalidDateRange = furtherPredicator(filterTimeRange, targetKey);
      if (isInvalidDateRange && fail) {
        fail(timeRange, targetKey);
      }
      return isEmptyList || isInvalidDateRange;
    }
    return false;
  };
}

/** 将看起来不像时间范围的值丢弃，比如 undefined；以及[timeStart]或[,timeEnd]这样的值不会被抛弃 */
export function dropNullableTimeRange(checkList: string[]) {
  return timeRangeBasePredicator(checkList);
}

/** 相比起`dropNullableTimeRange更加严格，会将undefined以及不完整的时间范围丢弃 */
export function dropNotFullFilledTimeRange(
  checkList: string[],
  fail?: (value: any, key: string) => void,
) {
  // 严格模式下，如果数组中有任意一个被判定为不符合格式，就会被丢弃
  // 如果是[]这种格式的，应该被丢弃而不应该被判定为错误
  const strictTimeRangePredicator = (v: any[]) => v.length !== 0 && v.length !== 2;
  return timeRangeBasePredicator(checkList, strictTimeRangePredicator, fail);
}
