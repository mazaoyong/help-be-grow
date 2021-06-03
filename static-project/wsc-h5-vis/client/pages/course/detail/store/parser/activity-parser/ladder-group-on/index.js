import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

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

  // 总的最大最小值
  const priceList = [];
  const ladderMap = {};
  const map = Object.keys(data.ladderPrice).reduce((obj, key) => {
    const skuLadderPrice = data.ladderPrice[key];
    const ladderPriceMap = {};
    // sku 维度的最大最小值
    const skuPriceList = [];
    skuLadderPrice.forEach(ladder => {
      priceList.push(ladder.skuPrice);
      skuPriceList.push(ladder.skuPrice);
      ladderPriceMap[ladder.scale] = ladder.skuPrice;
      const skuItem = {
        skuId: key,
        price: ladder.skuPrice,
      };
      if (ladderMap[ladder.scale]) {
        ladderMap[ladder.scale].skuPriceMap.push(skuItem);
      } else {
        ladderMap[ladder.scale] = {
          skuPriceMap: [skuItem],
        };
      }
    });
    obj[key] = {
      minPrice: Math.min(...skuPriceList),
      maxPrice: Math.max(...skuPriceList),
      ladderPriceMap,
    };
    return obj;
  }, {});

  Object.keys(ladderMap).forEach(ladder => {
    // 阶梯维度最大最小值
    const ladderPriceList = [];
    ladderMap[ladder].skuPriceMap.forEach(skuItem => {
      ladderPriceList.push(skuItem.price);
    });
    ladderMap[ladder].minPrice = Math.min(...ladderPriceList);
    ladderMap[ladder].maxPrice = Math.max(...ladderPriceList);
  });

  const activityData = {
    // 活动通用属性
    hasUmpBlock: true,

    status,

    priceTag: '阶梯拼团',

    sku: {
      minPrice: Math.min(...priceList),

      maxPrice: Math.max(...priceList),

      map,
    },

    startTime,

    endTime,

    activityId: data.id,

    // 阶梯维度 map
    ladder: ladderMap,

    // 从拼团详情页进入商详时带上的团标识
    groupAlias: args.get('groupAlias'),

    // 是否展示未成团列表
    isShowJoinGroup: data.isShowJoinGroup,

    // 未成团列表
    groupList: get(data, 'onGoingGroupList', []),

    // 当前用户是否已参团
    isJoined: Boolean(data.joinedGroup),

    // 已参团信息
    joinedGroup: data.joinedGroup,
  };

  return {
    activityData,
    ...buttonsRule(activityData, state),
  };
}
