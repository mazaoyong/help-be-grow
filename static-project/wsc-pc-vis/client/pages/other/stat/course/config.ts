import { isEduBranchStore } from '@youzan/utils-shop';

export const DATE_TYPE = [
  {
    type: 'day',
    title: '自然天',
    id: '1',
    validCycle: 90,
  },
  {
    type: 'month',
    title: '自然月',
    id: '3',
    validCycle: 12,
  },
];

export const errMsg = '抱歉，暂未获取到数据，请稍后刷新页面';

export const hqKdtId = isEduBranchStore ? _global.shopInfo.parentKdtId || _global.kdtId : _global.kdtId;
