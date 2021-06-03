import React from 'react';
import { BlankLink } from '@youzan/react-components';
import { isObject } from 'lodash';
import { isEduHqStore } from '@youzan/utils-shop';
import formatDate from '@youzan/utils/date/formatDate';

export const getFilterOptions = ctx => {
  let options = [
    {
      type: 'DateRangeQuickPicker',
      name: 'recordDateRange',
      label: '删除时间：',
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
      },
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
          return item.text.includes(keyword);
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
          return item.text.includes(keyword);
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
          return item.text.includes(keyword);
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
          <BlankLink
            href={`${window._global.url.v4}/vis/ump/clue/recycle#/detail/${data.clueId}`}
          >
            {data.name || '-'}
          </BlankLink>
        );
      },
    },
    {
      title: '手机号',
      bodyRender: data => {
        return (
          <BlankLink
            href={`${window._global.url.v4}/vis/ump/clue/recycle#/detail/${data.clueId}`}
          >
            {data.telephone}
          </BlankLink>
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
