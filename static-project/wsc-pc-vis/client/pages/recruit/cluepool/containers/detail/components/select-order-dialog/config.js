import React from 'react';
import format from '@youzan/utils/money/format';
import { BlankLink } from '@youzan/react-components';
import { Radio, ClampLines } from 'zent';
import { isEduHqStore } from '@youzan/utils-shop';
import { arrayColumnWrapper } from 'fns/chain';

export const filterOptions = campus =>
  arrayColumnWrapper([
    {
      type: 'DateRangeQuickPicker',
      name: 'bookTime',
      label: '下单时间：',
      props: {
        preset: [
          {
            text: '今',
            value: 0,
          },
          {
            text: '昨',
            value: 1,
          },
          {
            text: '近7天',
            value: 7,
          },
          {
            text: '近30天',
            value: 30,
          },
        ],
        max: new Date(),
      },
    },
    {
      type: 'Input',
      name: 'orderNo',
      label: '订单号：',
      props: {
        placeholder: '',
      },
    },
    {
      type: 'Input',
      name: 'lessonName',
      label: '购买课程：',
      props: {
        placeholder: '',
      },
    },
    {
      type: 'Input',
      name: 'studentName',
      label: '学员：',
      props: {
        placeholder: '',
      },
    },
    {
      type: 'Select',
      name: 'targetKdtId',
      label: '所属校区：',
      chainState: isEduHqStore,
      props: {
        placeholder: '',
        filter: (item, keyword) => {
          return item.text.includes(keyword);
        },
      },
      data: campus,
    },
  ]);

export const columns = arrayColumnWrapper([
  {
    title: <span style={{ marginLeft: '18px' }}>订单编号</span>,
    name: 'orderNo',
    width: '15%',
    bodyRender: data => {
      return (
        <span className="order-no-td">
          <span>
            <Radio value={data.orderNo} disabled={!data.selectable} />
          </span>
          <span>
            <BlankLink
              href={`${window._global.url.www}/trade/order/detail?order_no=${data.orderNo}`}
            >
              {data.orderNo}
            </BlankLink>
          </span>
        </span>
      );
    },
  },
  {
    title: '购买课程',
    name: 'lessonName',
    width: '15%',
    bodyRender: data => {
      return <ClampLines lines={2} text={data.lessonName} />;
    },
  },
  {
    title: '订单金额（元）',
    name: 'totalPay',
    textAlign: 'right',
    bodyRender: data => {
      return <span style={{ paddingRight: '6px' }}>{format(data.totalPay)}</span>;
    },
    width: '10%',
  },
  {
    title: '学员',
    name: 'studentName',
    width: '10%',
    bodyRender: data => {
      if (!data.studentName) return '-';
      return (
        <BlankLink href={`${window._global.url.v4}/vis/edu/page/student#/detail/${data.studentId}`}>
          {data.studentName}
        </BlankLink>
      );
    },
  },
  {
    title: '客户',
    name: 'buyerName',
    width: '10%',
    bodyRender: data => {
      return (
        <BlankLink
          href={`${window._global.url.v4}/scrm/customer/manage#/detail?yzUid=${data.buyerId}`}
        >
          {data.buyerName}
        </BlankLink>
      );
    },
  },
  {
    title: '下单时间',
    name: 'bookTime',
    width: '15%',
  },
  {
    title: '所属校区',
    name: 'campusShopName',
    chainState: isEduHqStore,
  },
  {
    title: '不可选原因',
    name: 'unSelectableReason',
    textAlign: 'right',
    bodyRender: data => {
      return data.selectable ? '-' : data.unSelectableReason;
    },
  },
]);
