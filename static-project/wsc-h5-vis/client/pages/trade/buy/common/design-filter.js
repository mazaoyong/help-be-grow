import { designAdapter } from './design-config';

/**
 * @file
 * 这里是对design列表做前置过滤逻辑
 * 在这里做的判断是根据订单商品和活动类型来判断block是否存在
 * 在block内部的判断是根据具体情况判断block是否展示
 */

/** @type {Array.<{type: string; filter: (state, getters) => boolean}>} */
const designFilters = [
  {
    type: 'groupon-explain-block',
    filter: (_state, getters) => {
      return getters.isGroupBuy;
    },
  },
  {
    type: 'package-buy-block',
    filter: (_state, getters) => {
      return getters.isPackageBuy;
    },
  },
  {
    type: 'course-block',
    filter: (_state, getters) => {
      return getters.isCourse || getters.isPaidContent;
    },
  },
  {
    type: 'service-block',
    filter: (_state, getters) => {
      return getters.isCourse;
    },
  },
  {
    type: 'student-block',
    filter: (_state, getters) => {
      return getters.isPackageBuy || getters.isCourse;
    },
  },
  {
    type: 'info-collect-block',
    filter: (_state, getters) => {
      return getters.isPackageBuy || getters.isPaidContent;
    },
  },
  {
    type: 'class-block',
    filter: (_state, getters) => {
      return getters.isCourse;
    },
  },
];

const designFilterMap = designFilters.reduce((map, { type, filter }) => {
  map[type] = filter;
  return map;
}, {});

export const designFilter = (design, { state, getters }) => {
  design = designAdapter(design);
  return design.filter(({ type }) => {
    const filter = designFilterMap[type];
    return filter ? filter(state, getters) : true;
  });
};
