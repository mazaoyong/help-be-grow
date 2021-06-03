import React from 'react';
import { ITableColumn } from '@zent/compat';
import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';

const columns: Array<ITableColumn> = [
  {
    title: '课程名称',
    name: 'name',
    bodyRender: data => {
      return <span>{data.name}</span>;
    },
  },
  {
    title: '适用年龄',
    name: 'age',
    bodyRender: data => {
      return <span>{getAgeRange(data.minApply, data.maxApply, data.applyType)}</span>;
    },
  },
  {
    title: '开班数',
    name: 'classNum',
    bodyRender: data => {
      return <span>{data.classNum}</span>;
    },
  },
];

function getAgeRange(minApply, maxApply, applyType) {
  if (maxApply === 10000) {
    if (minApply === 10000) {
      return '-';
    }
    return `${minApply}${applyType === 0 ? '月' : '岁'}以上`;
  } else if (maxApply === minApply) {
    return `${minApply}${applyType === 0 ? '月' : '岁'}`;
  }
  return `${minApply}~${maxApply}${applyType === 0 ? '月' : '岁'}`;
};

const filters: (filterRef) => ICombinedFilterConf[] = (filterRef) => [
  {
    name: 'title',
    label: '专栏名称：',
    defaultValue: '',
    type: 'Input',
    placeholder: '课程名称',
    inheritProps: {
      onPressEnter: () => {
        filterRef && filterRef.current && filterRef.current.submit();
      },
    },
  },
];

export { columns, filters };
