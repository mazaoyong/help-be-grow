// 获取二维码
import capTainAjax from 'captain-ajax';
import { ajax } from '@youzan/vis-ui';
import UA from '@youzan/utils/browser/ua_browser';
const { kdt_id: kdtId, miniprogram = {} } = window._global;
const isWeapp = miniprogram.isWeapp;
const platform = isWeapp ? 'weapp' : UA.isWeixin() ? 'weixin' : null;

export function getActivityApi(data) {
  return ajax({
    url: `/wscvis/knowledge/newActivityInfos.json`,
    data: Object.assign(data, {
      kdtId,
      platform,
    }),
    loading: false,
  });
};

export function getGrouponDetailApi(data) {
  return capTainAjax({
    url: '/wscvis/knowledge/getGrouponDetail.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
};

// 获取单个团的参团成员列表
export function getGroupMemberListApi(data) {
  return capTainAjax({
    url: '/wscvis/knowledge/getGroupOnJoinRecordByPage.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
};

// 获取用户昵称等信息
export function getUserInfoApi(data = {}) {
  return capTainAjax({
    url: '/wscvis/getWechatUserInfoByUserId.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
}

export function getPhoneApi(data = {}) {
  return capTainAjax({
    url: '/wscvis/getShopServicePhoneJson.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
}

// 获取分销员信息，以后分销员信息均使用此方法
export function getDistributorInfo(data = {}) {
  return ajax({
    url: '/wscvis/ump/getShareIcon.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
}

// 获取带有商品信息的公众号二维码(接口服务由ump提供，目前公众号涨粉插件在用)
export function getMpQrWithGoodInfo(data = {}) {
  return ajax({
    url: '/wscvis/ump/getAutoReplyGoodsQrCode.json',
    data: Object.assign(data, {
      kdtId,
    }),
  });
}
