import get from 'lodash/get';
import { ajax } from '@youzan/vis-ui';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';
import * as adapter from 'pct/api/adapter';

function getH5Link(path) {
  return get(window, '_global.url.h5') + path;
}

const Api = {

  getColumn: adapter.getColumn(function(data) {
    return ajax({
      url: getH5Link('/wscvis/course/getDetail.json'),
      data,
      withCredentials: true,
      toCamelCase: true,
    });
  }),

  getContent: adapter.getContent(function(data) {
    // 因为支付页的域名是 cashier.youzan.com，所以需要写死域名
    return ajax({
      url: getH5Link('/wscvis/course/getDetail.json'),
      data,
      withCredentials: true,
    });
  }),
  // 预下单信息
  postPreorder(data) {
    return ajax({
      url: '/pay/wscvis_ptc_pay/confirm.json',
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      data,
    }).then(data => mapKeysToSnakeCase(data));
  },
  // 订阅
  postSubscribe(data) {
    return ajax({
      url: '/pay/wscvis_ptc_pay/create.json',
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },

  // 获取优惠券
  getCoupons(data) {
    return ajax({
      url: getH5Link('/v2/ump/paidcontent/couponlist.json'),
      data,
      withCredentials: true,
    });
  },

  getLiveDetail: adapter.getLiveDetail(function(data) {
    return ajax({
      url: getH5Link('/wscvis/course/getDetail.json'),
      data,
      withCredentials: true,
    });
  }),

  getPunchDetail(data) {
    return ajax({
      url: getH5Link('/wscvis/punch/getPunchDetailByAlias'),
      data,
      withCredentials: true,
    });
  },

  // 兑换优惠码
  exchangeCode(data) {
    const url = `${window._global.url.wap}/showcase/promocode/exchangeCode.jsonp`;
    return ajax({
      url,
      dataType: 'jsonp',
      data,
    });
  },

  // 获取店铺活动信息
  getActivities(data) {
    return ajax({
      url: '/v2/ump/knowledgeActivity/activityInfos.json',
      data,
      withCredentials: true,
    });
  },

  // 获取信息采集回填信息
  getBuyerInfo(data) {
    return ajax({
      url: '/pay/wscvis_ptc_pay/buyerInfo.json',
      data,
      withCredentials: true,
    });
  },

  // 前端上报数据
  postSkynetJson(data) {
    return ajax({
      url: getH5Link('/wscvis/knowledge/utils/skynetlog.json'),
      type: 'post',
      dataType: 'json',
      data,
      withCredentials: true,
      loading: false,
    });
  },
};

export default Api;
