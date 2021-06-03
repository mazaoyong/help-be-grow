import { ajax } from '@youzan/vis-ui';

export function getPayStateInfo(data) {
  return ajax({
    url: '/wscvis/order/getPayStateInfo.json',
    data,
    loading: false,
  });
};

export function getPayRewardInfo(data) {
  return ajax({
    url: '/wscvis/order/getPayRewardInfo.json',
    data,
    loading: false,
  });
};

export function getUmpInfo(data) {
  return ajax({
    url: '/wscvis/order/getUmpInfoV2.json',
    data,
    loading: false,
  });
};

export function getRecommendGoods() {
  return ajax({
    url: '/wscvis/order/getRecommendGoods.json',
    loading: false,
  });
};

// 支付成功页获取预约状态
export function hasTradeWithLessonAppointment(data) {
  return ajax({
    url: '/wscvis/edu/hasTradeWithLessonAppointment.json',
    data,
    loading: false,
  });
};

// 下单结果页转介绍入口,获取店铺中进行中的活动
export function getIntroductionActivity(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getIntroductionActivity.json',
    data,
    loading: false,
  });
};

// 获取加粉推广配置
export function getJoinGroupSetting(data) {
  return ajax({
    url: '/wscvis/order/getJoinGroupSetting.json',
    data,
    loading: false,
  });
}

/* 获取店铺积分别名 */
export function getCustomPointName(data) {
  return ajax({
    url: '/wscvis/getCustomPointName.json',
    data,
    loading: false,
  });
}

/* 获取店铺元信息 */
export function getShopMetaInfo(data) {
  return ajax({
    url: '/wscvis/getShopMetaInfo.json',
    data,
    loading: false,
  });
}
