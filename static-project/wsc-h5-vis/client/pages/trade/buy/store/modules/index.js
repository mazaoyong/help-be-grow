import { find } from 'lodash';
import * as goodsModule from './goods';
import * as shopModule from './shop';
import * as umpModule from './ump';
import * as payModule from './pay';
import * as priceModule from './price';
import * as prepayCardModule from './prepay-card';
import * as classModule from './class';
import * as orderModule from './order';
import * as viewModule from './view';
import * as logModule from './log';
import * as SaasModule from './saas';

export const moduleList = [
  goodsModule,
  shopModule,
  umpModule,
  payModule,
  priceModule,
  prepayCardModule,
  classModule,
  orderModule,
  viewModule,
  logModule,
  SaasModule,
];

export const assignOrderData = (state, orderData) => {
  moduleList.forEach(({ assignOrderData }) => {
    if (assignOrderData) {
      assignOrderData(state, orderData);
    }
  });

  // 如果是0元单或积分足额抵扣
  // 优惠券与储值卡/礼品卡不设默认选中
  if (state.pay.realPay === 0) {
    state.giftCard.checked = [];
    state.valueCard.checked = [];
  }

  const chosenCoupon = find(state.coupon.list, (item) => item.choose) || {};
  state.coupon.chosenId = chosenCoupon.id || 0;
};
