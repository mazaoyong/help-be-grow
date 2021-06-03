import { ajax } from '@youzan/vis-ui';

/**
 * 获取学员信息列表
 *
 * @param {Object} data - 入参
 * @param {Array.<number>} data.classIdList - 班级id数组
 * @return {Promise}
 */
export const getStudentList = data => {
  return ajax({
    url: '/pay/wscvis_trade/edu/student/list.json',
    data: {
      classIdList: JSON.stringify(data.classIdList),
    },
  });
};

/**
 * 获取基础商品信息
 *
 * @param {Array} aliases - 商品alias数组
 * @return {Promise}
 */
export const getCourseList = aliases => {
  return ajax({
    url: '/pay/wscvis_trade/course/list.json',
    data: {
      aliases: aliases.join(','),
    },
    loading: false,
  });
};

/**
 * 获取直播详情
 *
 * @param {Object} data - 入参
 * @param {string} data.alias -
 * @return {Promise}
 */
export const getLive = data => {
  return ajax({
    url: '/pay/wscvis_trade/course/live.json',
    data,
    loading: false,
  });
};

/**
 * 兑换优惠码（这个接口是打到h5-trade!!）
 * http://zanapi.qima-inc.com/site/service/view/120347
 * com.youzan.ebiz.mall.trade.buyer.api.service.AssetsService.exchangeCoupon
 *
 * @param {Object} data - 入参
 * @return {Promise}
 */
export const getExchangeCoupon = data => {
  return ajax({
    method: 'POST',
    url: '/pay/wsctrade/order/buy/exchangeCoupon.json',
    data,
  });
};

/**
 * 获取课程地址列表
 *
 * @param {Object} data - 入参
 * @param {Array.<string>} data.storeIds - 课程地址
 * @param {string} [data.latitude] -
 * @param {string} [data.longitude] -
 * @return {Promise}
 */
export const getAddressList = data => {
  return ajax({
    url: '/pay/wscvis_trade/edu/address/list.json',
    data: {
      ...data,
      storeIds: JSON.stringify(data.storeIds),
    },
  });
};

// 订单 - 预下单
// http://zanapi.qima-inc.com/site/service/view/709041
// com.youzan.owl.api.trade.TradeOrderFacade.confirm
export const postConfirmOrder = data => {
  return ajax({
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    url: '/pay/wscvis_buy/confirm.json',
    data,
    rawResponse: true,
  });
};

// 订单 - 下单
// http://zanapi.qima-inc.com/site/service/view/709042
// com.youzan.owl.api.trade.TradeOrderFacade.create
export const postCreateOrder = data => {
  return ajax({
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    url: '/pay/wscvis_buy/create.json',
    data,
    rawResponse: true,
  });
};
