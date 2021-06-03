/**
 * biz场景下使用的extension，仅用于开发，不用于发布。
 * 发布使用extensions下的bundle
 * **/
import PayActionsButtons from '../../../extensions/pay-actions-buttons';
import PayActionsPromotion from '../../../extensions/pay-actions-promotion';
import PayReceiptContainer from '../../../extensions/pay-receipt-container';
import PayResult from '../../../extensions/pay-result';
import PayReward from '../../../extensions/pay-reward';
import PayUmpFissionCoupon from '../../../extensions/pay-ump-fission-coupon';
import PayUmpPresent from '../../../extensions/pay-ump-present';
import PayUmpReward from '../../../extensions/pay-ump-reward';

export const extensions = {
  'pay-result': PayResult,
  'pay-reward': PayReward,

  'pay-actions-buttons': PayActionsButtons,
  'pay-actions-promotion': PayActionsPromotion,
  'pay-receipt-container': PayReceiptContainer,

  'pay-ump-fission-coupon': PayUmpFissionCoupon,
  'pay-ump-present': PayUmpPresent,
  'pay-ump-reward': PayUmpReward,
};
