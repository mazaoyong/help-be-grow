/**
 * @file
 * 这里是订单提交的之后的跳转逻辑
 * 0元单/收银台跳转统一走这套逻辑
 */

import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import { SERVICE_PLEDGE } from '@/constants/course/service-pledge';
import { COURSE_TYPE } from '@/constants/course/course-type';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';

export const getRedirectParam = (state, getters, isMockOrderNo) => {
  const orderNo = isMockOrderNo ? '{orderNo}' : state.order.orderNo;
  const { alias } = getters.singleGoods;

  // 有指定订单成功后redirect地址，直接返回该地址
  // 场景1：https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=18395
  const orderFinishRedirect = args.get('orderFinishRedirect');
  if (orderFinishRedirect) {
    return { url: orderFinishRedirect };
  }

  // 优惠套餐跳到支付结果页
  if (getters.isPackageBuy) {
    const pageType = getPackagePaidStatusPageType(state, getters);
    return {
      url: '/wscvis/order/paid-status',
      query: {
        orderNo,
        orderType: 'package',
        activityAlias: state.shop.activityAlias,
        pageType,
      },
    };
  }

  // 拼团直接跳到拼团分享页
  if (getters.isGroupBuy) {
    return {
      url: '/wscvis/ump/groupon/groupon-detail',
      query: {
        order_no: orderNo,
        activity_type: state.shop.activityType,
        alias,
        isFromPay: true,
      },
    };
  }

  // 送礼（请好友看）跳转到领取页面
  if (getters.isGift) {
    return {
      url: '/wscvis/knowledge/index',
      query: {
        page: 'giftshow',
        order_alias: orderNo,
        alias,
        channel_type: 3,
        gift_type: 1,
        isFromPay: true,
      },
    };
  }

  // 跳到支付结果页
  return {
    url: '/wscvis/order/paid-status',
    query: { orderNo, alias, lessonNo: state.appointment.lesson },
  };
};

// 获取优惠套餐在支付完成页展示类型
// 0: 什么都不展示 1：展示预约 2：展示二次确认 3:？
function getPackagePaidStatusPageType(state, getters) {
  // 优惠套餐中不包含线下课
  if (!getters.isNeedStudent) {
    return 0;
  }

  // 优惠套餐中的线下课需要预约
  if (
    getters.goodsList.some(item => {
      const courseType = get(item, 'orderCourseDTO.courseType');
      const courseSellType = get(item, 'orderCourseDTO.courseSellType');
      const intentTime = get(item, 'config.intentTime');
      return (
        courseType === COURSE_TYPE.FORMAL &&
        (courseSellType === COURSE_SELL_TYPE.COUNT ||
          courseSellType === COURSE_SELL_TYPE.DURATION) &&
        intentTime === 1
      );
    })
  ) {
    return 1;
  }

  // 优惠套餐中的线下课需要二次确认
  if (
    getters.goodsList.some(
      item =>
        get(item, 'orderCourseDTO.servicePledge') === SERVICE_PLEDGE.CHECK_AGAIN
    )
  ) {
    return 2;
  }

  // 包含线下课
  return 3;
}
