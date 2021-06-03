/* 打包、发布单元，可以每次修改要打包、发布的内容 */
import PayActionsButtons from './pay-actions-buttons';
import PayActionsPromotion from './pay-actions-promotion';
import PayReceiptContainer from './pay-receipt-container';
import PayResult from './pay-result';
import PayReward from './pay-reward';
import PayUmpFissionCoupon from './pay-ump-fission-coupon';
import PayUmpPresent from './pay-ump-present';
import PayUmpReward from './pay-ump-reward';

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
