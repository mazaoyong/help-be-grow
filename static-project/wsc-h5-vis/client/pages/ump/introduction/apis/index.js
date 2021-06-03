/**
 * 通用接口
 */
import { ajax } from '@youzan/vis-ui';

// 获取推荐商品
export function getRecommendGoods() {
  return ajax({
    url: '/wscvis/order/getRecommendGoods.json',
    loading: false,
  });
}

// 查询推荐商品信息，根据不同的业务场景
export function getGoodsRecommendInfo(data) {
  return ajax({
    url: '/wscvis/order/getGoodsRecommendInfo.json',
    data,
    loading: false,
  });
}

// 获取已参加活动的人数
export function getActivityParticipatePeople(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getActivityParticipatePeople.json',
    data,
  });
}

// 图片检验
export function imageAppraise(data) {
  return ajax({
    url: '/wscvis/ump/introduction/imageAppraise.json',
    data,
  });
}

export function getCollectZanUserStatus(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getCollectZanUserStatus.json',
    data,
  });
}
