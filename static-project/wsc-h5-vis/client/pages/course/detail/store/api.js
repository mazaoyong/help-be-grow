import { ajax } from '@youzan/vis-ui';

export function getDetail(alias) {
  return ajax({
    url: '/wscvis/course/detail/goods.json',
    data: {
      alias,
    },
  });
}

export function getActivity(alias) {
  return ajax({
    url: '/wscvis/course/detail/activity.json',
    data: {
      alias,
    },
  });
}

export function getNextOwl(alias, sortType, columnAlias) {
  return ajax({
    url: '/wscvis/course/column/getNextEduProductInfo.json',
    data: {
      alias,
      sortType,
      columnAlias,
    },
    loading: false,
  });
}

export function receiveCoupon({ couponId, bizName, requestId }) {
  return ajax({
    url: '/wscvis/ump/goods/receiveCoupon.json',
    data: { activityId: couponId, bizName, requestId },
    loading: false,
  });
}

export function getCouponList(goodsId) {
  return ajax({
    url: '/wscvis/ump/goods/getCouponList.json',
    data: { goodsId },
    loading: false,
  });
}
