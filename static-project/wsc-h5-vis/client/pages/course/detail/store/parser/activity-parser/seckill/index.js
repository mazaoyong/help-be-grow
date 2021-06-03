import { get } from 'lodash';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state) {
  const { goodsData } = state;
  const startTime = data.beginAt * 1000;
  const endTime = data.endAt * 1000;

  let status = ACTIVITY_STATUS.UNSTART;
  if (Date.now() > startTime) {
    status = ACTIVITY_STATUS.GOING;
  }
  if (Date.now() > endTime) {
    status = ACTIVITY_STATUS.END;
  }

  let stockNum = data.currentStock;
  const skus = get(data, 'skuInfos', []);
  const priceList = [];
  const map = skus.reduce((obj, item) => {
    obj[item.skuId] = {
      price: item.seckillPrice,
      stockNum: item.currentStock,
    };
    priceList.push(item.seckillPrice);
    return obj;
  }, {});

  // 按期售卖课程，秒杀库存取最小值
  if (goodsData.courseSellType === COURSE_SELL_TYPE.SESSION && goodsData.sku.restStock < stockNum) {
    stockNum = goodsData.sku.restStock;
  }

  // 秒杀不隐藏库存
  goodsData.hideStock = false;

  const activityData = {
    // 活动通用属性
    hasUmpBlock: true,

    status,

    priceTag: get(data, 'tag', '秒杀'),

    sku: {
      minPrice: Math.min(...priceList),

      maxPrice: Math.max(...priceList),

      stockNum,

      originStock: data.activityStock,

      map,
    },

    startTime,

    endTime,

    // 秒杀活动属性
    activityId: data.activityId,

    activityAlias: data.activityAlias,

    isCheckRight: data.isCheckRight,

    isLimit: data.isLimit,

    limitNum: data.limitNum,

    useFollow: data.useFollow,

    useQuestion: data.useQuestion,

    questionId: data.questionId,

    isUserBooking: data.isUserBooking,

    isUserRemind: data.isUserRemind,
  };

  return {
    activityData,
    ...buttonsRule(activityData, state),
  };
}
