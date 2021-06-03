import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { GROUP_BUY_TYPE } from '@/constants/ump/group-buy-type';
import buttonsRule from './buttons';

import getShareInfo from './share-info';

export default function(data, state) {
  const startTime = data.startAt * 1000;
  const endTime = data.endAt * 1000;
  let status = ACTIVITY_STATUS.UNSTART;
  if (Date.now() > startTime) {
    status = ACTIVITY_STATUS.GOING;
  }
  if (Date.now() > endTime) {
    status = ACTIVITY_STATUS.END;
  }

  let priceTag = '';
  if (data.groupType === GROUP_BUY_TYPE.OLD_NEW) {
    priceTag += '老带新';
  }
  priceTag += `${data.conditionNum}人团`;

  const priceList = [];
  const map = Object.keys(data.skuPrices).reduce((obj, key) => {
    const price = data.skuPrices[key];
    priceList.push(price);
    obj[key] = {
      price,
    };
    return obj;
  }, {});

  // 此处为拼团的最高价格
  const maxPrice = Math.max(...priceList);

  const activityData = {
    // 活动通用属性
    hasUmpBlock: true,

    status,

    priceTag,

    sku: {
      minPrice: Math.min(...priceList),

      maxPrice,

      map,
    },

    startTime,

    endTime,

    activityId: data.id,

    // 从拼团详情页进入商详时带上的团标识
    groupAlias: args.get('groupAlias'),

    // 拼团类型
    groupType: data.groupType,

    // 成团人数
    conditionNum: +data.conditionNum,

    // 是否展示未成团列表
    isShowJoinGroup: data.isShowJoinGroup,

    // 未成团列表
    groupList: get(data, 'onGoingGroupList', []),

    // 当前用户是否已参团
    isJoined: Boolean(data.joinedGroup),

    // 已参团信息
    joinedGroup: data.joinedGroup,
  };

  let shareInfo = {};

  // 分享信息解析报错不应该影响活动展示
  try {
    shareInfo = getShareInfo(state.goodsData, map, maxPrice);
  } catch (err) {
    console.error(err);
  }

  return {
    shareInfo,
    activityData,
    ...buttonsRule(activityData, state),
  };
}
