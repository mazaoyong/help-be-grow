import get from 'lodash/get';

/**
 * 发货方式
 *
 * 12, "快递 - 商家呼叫快递"
 * 13, "快递 - 无需物流"
 * 14, "快递 - 电子面单"
 * 21, "同城送 - 商家呼叫三方配送"
 * 22, "同城送 - 商家自主配送"
 */

export const DELIVERY_MODE = {
  expressByMerchant: {
    value: 12,
    text: '自己联系快递',
  },
  withoutExpress: {
    value: 13,
    text: '无需物流',
  },
  expressOnDoor: {
    value: 14,
    text: '在线下单',
  },
  intraCityCall: {
    value: 21,
    text: '呼叫三方配送',
  },
  intraCityByMerchant: {
    value: 22,
    text: '商家自行配送',
  },
};

export const EXPRESS_TYPES = {
  // 快递
  express: {
    value: 0,
    deliveryTypes: ['expressOnDoor', 'expressByMerchant', 'withoutExpress'],
  },
  // 上门自提
  selfPick: {
    value: 1,
    deliveryTypes: ['expressByMerchant', 'withoutExpress'],
  },
  // 同城送
  intracity: {
    value: 2,
    deliveryTypes: ['intraCityByMerchant', 'intraCityCall', 'expressByMerchant'],
  },
};

export const DIST_TYPES = ['express', 'selfPick', 'intraCity'];

export const EXPRESS_WAY_BILL_TYPES = {
  printAndCallCourier: {
    value: 2,
    text: '打印面单并呼叫快递员',
  },
  callCourierOnly: {
    text: '仅呼叫快递员上门取件',
    type: 3,
  },
  printOnly: {
    value: 1,
    text: '仅打印面单',
  },
};

export const EXPRESS_WAY_BILL_TYPES_MAP = {
  1: ['printOnly'],
  2: ['printAndCallCourier'],
};

export const globalUrlBase = get(window._global, 'url.www', '//www.youzan.com/v2');
