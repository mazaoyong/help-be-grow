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
  });
};
