import { get } from 'lodash';
import {
  beforeCreateOrderEvent,
  afterCreateOrderEvent,
  afterCreateOrderEventAsync,
  onPayItemClickEvent,
} from '../../../saas';
import { openState } from '../../../saas/state';

const actions = {
  CLOUD_BEFORE_CREATE_ORDER({ state, getters }) {
    const payment = openState.payment({ state, getters });
    const goodsList = openState.goodsList({ state, getters });
    const studyInfo = openState.studyInfo({ state, getters });
    return beforeCreateOrderEvent.trigger({ studyInfo, goodsList, payment });
  },

  CLOUD_AFTER_CREATE_ORDER({ state }, orderResult) {
    const args = {
      orderNo: orderResult.orderNo,
    };
    afterCreateOrderEvent.trigger(args);
  },

  CLOUD_AFTER_CREATE_ORDER_ASYNC({ state }, orderResult) {
    const args = {
      orderNo: orderResult.orderNo,
    };
    return afterCreateOrderEventAsync.trigger(args);
  },

  CLOUD_PAY_ITEM_CLICK({ state }, payload = {}) {
    // 组装数据
    const args = {
      payChannel: get(payload, 'payWay.pay_channel'),
      payChannelName: get(payload, 'payWay.pay_channel_name'),
    };
    return onPayItemClickEvent.trigger(args);
  },
};

export const store = {
  actions,
};
