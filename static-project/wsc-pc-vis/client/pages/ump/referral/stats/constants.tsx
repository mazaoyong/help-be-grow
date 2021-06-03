import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { isEduHqStore } from '@youzan/utils-shop';
import date from '@youzan/utils/date';
import fen2yuan from 'fns/fen2yuan';
import { arrayColumnWrapper } from 'fns/chain';
import { DateFormat, POINTS_NAME } from '../constants';

const { makeDateTimeStr } = date;

const { DatePickerTypes } = EasyList;

export const curDateTime = makeDateTimeStr(new Date(), 'YYYY年MM月DD日 HH:mm:ss');

export const EncryptedPhoneNumber = (phone: string = '') => {
  const phoneArr = String(phone).split('');
  phoneArr.splice(3, 4, ...'****'.split(''));
  const encodePhone = phoneArr.join('');
  return encodePhone;
};

export const showUser = (userId: number, name: string, phone: string) => {
  return (
    <div className="user-display">
      <div>
        <a
          href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
      </div>
      <div>{EncryptedPhoneNumber(phone)}</div>
    </div>
  );
};

export const detailFilterConfig: any = (campusList) =>
  arrayColumnWrapper([
    {
      name: 'oldCustomerKeyword',
      label: '推荐人：',
      type: 'Input',
      inheritProps: {
        placeholder: '名称或者手机号',
      },
    },
    {
      name: 'orderNo',
      label: '订单号：',
      type: 'Input',
    },
    {
      name: 'designatedKdtId',
      label: '所属校区：',
      type: 'Select',
      options: campusList,
      chainState: isEduHqStore,
      defaultValue: -1,
    },
    {
      name: 'timeRange',
      label: '奖励发放时间：',
      type: DatePickerTypes.DateRangeQuickPicker,
      inheritProps: {
        canClear: false,
        valueType: 'number',
        format: DateFormat,
      },
    },
  ]);

export const detailColumns: IEasyGridColumn[] = arrayColumnWrapper([
  {
    title: '被推荐人',
    bodyRender: (data) => {
      return showUser(data.newCustomerUserId, data.newCustomerName, data.newCustomerPhone);
    },
  },
  {
    title: '所属校区',
    name: 'newCustomerShopName',
    chainState: isEduHqStore,
  },
  {
    title: '被推荐人立减金额（元）',
    textAlign: 'right',
    width: '190px',
    bodyRender: (data) => {
      const { discountValue } = data;
      return discountValue ? fen2yuan(discountValue) : '-';
    },
  },
  {
    title: '订单号',
    width: '230px',
    bodyRender: (data) => {
      return (
        <a
          href={`${_global.url.v4}/trade/order/detail?orderNo=${data.orderNo}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.orderNo}
        </a>
      );
    },
  },
  {
    title: '推荐人',
    name: 'oldCustomerName',
    bodyRender: (data) => {
      return showUser(data.oldCustomerUserId, data.oldCustomerName, data.oldCustomerPhone);
    },
  },
  {
    title: '推荐人佣金奖励（元）',
    textAlign: 'right',
    width: '170px',
    bodyRender: (data) => {
      return fen2yuan(data.commissionValue || 0);
    },
  },
]);

// 活动概况字段映射
export const summaryTitleMap1: Record<string, string> = {
  activityPv: '浏览量',
  activityUv: '浏览人数',
  refererCount: '推荐人参与数',
  refereeCount: '被推荐人参与数',
  orderCount: '累计支付订单数',
  orderAmount: '累计订单实付金额（元）',
};

export const summaryTitleMap2: Record<string, string> = {
  discountSum: '累计被推荐人折扣金额（元）',
  commissionSum: '累计发放佣金（元）',
  bonusPoint: `累计发放${POINTS_NAME}数`,
  couponCount: '累计发放优惠券数',
  presentCount: '累计发放赠品数',
};

// 活动概况中为金额的字段（需要做单位换算 分 -> 元）
export const amountField = ['orderAmount', 'discountSum', 'commissionSum'];
