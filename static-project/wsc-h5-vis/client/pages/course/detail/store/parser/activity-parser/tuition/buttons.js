import format from '@youzan/utils/money/format';
import { USER_TUITION_STATUS } from '@/constants/ump/tuition-status';
import pay from '@/pages/course/detail/store/pay';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import getDefaultButtonText from '../default-button-text';

export default function(activityData, state, activityTypes) {
  const { sellerType, column = {}, sku } = state.goodsData;
  const defaultButtonText = getDefaultButtonText(state);

  function tuitionPay() {
    pay(ACTIVITY_TYPE.TUITION, null, 'tuition');
  };

  function zeroBuy() {
    pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'zero-buy');
  }

  let skuButtons = [{
    text: '学费兑换',
    action: tuitionPay,
  }];

  const viewColumnButton = {
    text: '查看专栏',
    url: `/wscvis/course/detail/${column.alias}?kdt_id=${_global.kdtId || ''}`,
  };

  if (sellerType === SELLER_TYPE.COLUMN) {
    return { buttons: [viewColumnButton] };
  }

  const buttons = [];

  if (sellerType === SELLER_TYPE.BOTH) {
    buttons.push(viewColumnButton);
  }

  if (!sku.maxPrice) {
    buttons.push({
      text: defaultButtonText,
      action: zeroBuy,
    });
    return { buttons };
  }

  const { hasUserInstance, userInstance } = activityData.tuition;
  const { tuitionAmount, instanceStatus } = userInstance || {};

  if (hasUserInstance && instanceStatus === USER_TUITION_STATUS.GOING && tuitionAmount > 0) {
    buttons.push({
      text: ['学费兑换', `立减 ¥${+format(tuitionAmount, true, false)}`],
      action: tuitionPay,
    });
    return {
      buttons,
      skuButtons,
    };
  }

  buttons.push({
    text: defaultButtonText,
    action: tuitionPay,
  });
  return { buttons, skuButtons: buttons };
};
