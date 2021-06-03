import format from '@youzan/utils/money/format';
import buttonsRule from './buttons';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { USER_TUITION_STATUS } from '@/constants/ump/tuition-status';

export default function(data, state) {
  const { sku } = state.goodsData;

  let priceTag = '';

  const { status, hasUserInstance, userInstance } = data;
  const { tuitionAmount, instanceStatus } = userInstance || {};

  if (
    status === ACTIVITY_STATUS.GOING &&
    hasUserInstance &&
    instanceStatus === USER_TUITION_STATUS.GOING &&
    +tuitionAmount > 0 &&
    sku.maxPrice > 0
  ) {
    priceTag = `立减 ¥${+format(tuitionAmount, true, false)}`;
  }

  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    tuition: data,

    // 生成 bookKey 需要用的参数
    activityId: data.outerActivityId,
    activityAlias: data.alias,
    activityType: data.outerActivityType,

    tuitionDeduction: {
      isUseTuitionDeduction: true,
      activityId: data.outerActivityId,
    },

    priceTag,
  };

  return {
    activityData,
    ...buttonsRule(activityData, state),
  };
}
