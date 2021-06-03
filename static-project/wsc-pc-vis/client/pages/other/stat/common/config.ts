import { isEduBranchStore } from '@youzan/utils-shop';

export const hqKdtId = isEduBranchStore ? _global.shopInfo.parentKdtId || _global.kdtId : _global.kdtId;

// @ts-ignore
export const yesterdayReady = window._global.yesterdayReady;

// @ts-ignore
export const lastMonthReady = window._global.lastMonthReady;

// todo
export const lastValidDate = {
  // day: true,
  // month: true,
  day: yesterdayReady,
  month: lastMonthReady,
};
