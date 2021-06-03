import React from 'react';
import { IGridColumn } from 'zent';
import date from '@youzan/utils/date';

import CommonLink from 'components/common-link';

const { formatDate } = date;

export const PAGINATION_SIZE = 5;

export const columns: IGridColumn[] = [
  {
    title: '客户名称',
    name: 'nickname',
    width: 160,
    bodyRender({ nickname, userId }) {
      if (userId === 9999999999999) {
        return '其他客户';
      }
      return (
        <CommonLink
          url={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
        >
          <span
            className="ellipsis-2"
            title={nickname}
          >
            {nickname}
          </span>
        </CommonLink>
      );
    },
  },
  {
    title: '学习次数',
    name: 'watchTimes',
    needSort: true,
  },
  {
    title: '学习时长(分钟)',
    name: 'watchDuration',
    needSort: true,
  },
  {
    title: '首次学习时间',
    name: 'firstWatchAt',
    needSort: true,
    bodyRender({ firstWatchAt }) {
      return formatDate(firstWatchAt, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '地区/城市',
    width: '20%',
    bodyRender({ province, city }) {
      return (
        <span
          className="ellipsis-2"
          title={`${province}/${city}`}
        >
          {`${province}/${city}`}
        </span>
      );
    },
  },
  {
    title: '终端',
    name: 'terminal',
    width: 160,
  },
];
