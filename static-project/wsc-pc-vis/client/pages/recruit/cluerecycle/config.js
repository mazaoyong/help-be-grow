import React from 'react';
import { Tag } from 'zent';
import { BlankLink } from '@youzan/react-components';
import { isObject } from 'lodash';
import { isEduHqStore } from '@youzan/utils-shop';
import formatDate from '@youzan/utils/date/formatDate';

const learnStatusInfo = [
  {
    status: 1,
    title: '在读',
    theme: 'green',
  },
  {
    status: 2,
    title: '结业',
    theme: 'grey',
  },
  {
    status: 3,
    title: '试听',
    theme: 'yellow',
  },
  {
    status: 4,
    title: '',
  },
];

const showStatus = learnStatus => {
  if (learnStatus === 0) return null;
  const statusInfo = learnStatusInfo.find(item => item.status === learnStatus);
  if (!statusInfo) return null;
  const { title, theme } = statusInfo;
  if (!title) return null;
  return <Tag theme={theme} outline>{title}</Tag>;
};

export const getFilterOptions = ctx => {
  let options = [
    {
      type: 'TimeRangePicker',
      name: 'recordDateRange',
      label: '删除时间：',
    },
    {
      type: 'Input',
      name: 'name',
      label: '姓名：',
      props: {
        placeholder: '请输入姓名',
      },
    },
    {
      type: 'Input',
      name: 'telephone',
      label: '手机号码：',
      props: {
        placeholder: '请输入手机号',
        maxLength: 11,
      },
    },
    {
      type: 'Select',
      name: 'ownerId',
      label: '删除人：',
      props: {
        placeholder: '全部',
        filter: (item, keyword) => {
          return item.text.indexOf(keyword) > -1;
        },
      },
      data: ctx.state.staff,
    },
    {
      type: 'Select',
      name: 'deleteReason',
      label: '删除原因：',
      props: {
        placeholder: '全部',
        filter: (item, keyword) => {
          return item.text.indexOf(keyword) > -1;
        },
      },
      data: ctx.state.deleteReasons,
    },
  ];

  // 连锁总店，要支持筛选校区
  if (isEduHqStore) {
    options.splice(-1, 0, {
      type: 'Select',
      name: 'kdtId',
      label: '所属校区：',
      props: {
        placeholder: '全部',
        filter: (item, keyword) => {
          return item.text.indexOf(keyword) > -1;
        },
      },
      data: ctx.state.campus,
    });
  }

  return options;
};

export const getColumns = ctx => {
  const columns = [
    {
      title: '姓名',
      name: 'name',
      bodyRender: data => {
        return (
          <>
            <BlankLink
              href={`${window._global.url.v4}/vis/edu/page/clue/recycle#/detail/${data.clueId}`}
            >
              {data.name || '-'}
            </BlankLink>
            <br/>
            <BlankLink
              href={`${window._global.url.v4}/vis/edu/page/clue/recycle#/detail/${data.clueId}`}
            >
              {data.telephone} {showStatus(data.learnStatus)}
            </BlankLink>
          </>
        );
      },
    },
    {
      title: '删除时间',
      name: 'deleteTime',
      needSort: true,
      bodyRender: data => {
        return formatDate(data.deleteTime, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '删除人',
      name: 'deleteOperator',
      bodyRender: data => {
        if (isObject(data.deleteOperator)) {
          return data.deleteOperator.name;
        } else {
          return '-';
        }
      },
    },
    {
      title: '删除原因',
      name: 'deleteReason',
    },
  ].concat(
    isEduHqStore
      ? [
        {
          title: '所属校区',
          name: 'ownerSchoolName',
        },
      ]
      : [],
  );

  // 最后一列右对齐
  columns[columns.length - 1].textAlign = 'right';

  return columns;
};
