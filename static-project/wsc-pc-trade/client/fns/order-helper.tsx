import React from 'react';
import { get, some, find } from 'lodash';
import { IOrder } from 'definitions/order/detail/order';

// 微信小程序匿名用户截取
export function getWeappCustomerName(customer) {
  const fdStart = customer.indexOf('wx_appservice');
  let newCustomer = '';
  if (fdStart === 0) {
    newCustomer = customer.replace(/wx_appservice/i, '小程序匿名用户');
  } else {
    newCustomer = customer;
  }
  return newCustomer;
}

/**
 * 显示买家昵称
 * @param orderInfo 订单信息
 * @param showPureCustomerName 是否显示纯昵称 - 不带标签
 */
export function getCustomer(orderInfo: IOrder, showPureCustomerName = false) {
  const { customer, customerId, customerType, buyerId } = orderInfo;

  if (!showPureCustomerName) {
    if (buyerId) {
      return (
        <a
          href={`/v4/scrm/customer/manage#/detail?yzUid=${buyerId}`}
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: customer }}
          target="_blank"
        />
      );
    } else if (+customerId && customerType === 1) {
      return (
        <a
          href={`/v4/scrm/customer/manage#/detail?fansId=${customerId}`}
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: customer }}
          target="_blank"
        />
      );
    }
  }

  return <span>{getWeappCustomerName(customer)}</span>;
}

// 是否为周期购
export function isPeriodOrder(orderInfo: IOrder) {
  const activityType = +get(orderInfo, 'activityType');
  const items = get(orderInfo, 'items', []);
  const hasPeriodGoods = some(items, item => +item.goodsType === 24);

  // 新周期购activityType兼容老周期购
  // 新周期购、老周期购恶心逻辑来自老iron-front
  return activityType === 13 || hasPeriodGoods;
}

// 是否为电子卡券订单
export function isVirtualTicket(orderInfo: IOrder) {
  return get(orderInfo, 'isVirtualTicket', false);
}

// 是否为虚拟订单
export function isVirtualOrder(orderInfo: IOrder) {
  return get(orderInfo, 'isVirtualOrder', false);
}

/**
 * 获取订单返储值金的金额
 */
export function getAssertMoney(orderInfo: IOrder) {
  // 返储值金活动，当前不会同时存在多个
  let returnAssertMoney;

  // assertBusinessType 返储值金类型 团购 1、2，订单 203
  try {
    const assertBusinessDetail = JSON.parse(orderInfo.tcExtra.ASSET_BUSINESS_DETAIL);
    returnAssertMoney = find(
      assertBusinessDetail,
      assertItem => [1, 2, 203].indexOf(+assertItem.assertBusinessType) !== -1,
    ).assertBusiness;
  } catch (e) {
    //
  }

  return returnAssertMoney;
}
