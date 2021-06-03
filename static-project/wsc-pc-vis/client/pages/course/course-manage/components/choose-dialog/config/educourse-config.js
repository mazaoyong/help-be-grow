import assign from 'lodash/assign';
import getBasicConfig from './base-config.js';
import React from 'react';

const defaultOptions = {
  title: '选择课程',
  url: '',
  columns: [
    {
      title: '课程名称',
      name: 'name',
      bodyRender: data => {
        return <span>{data.name}</span>;
      },
    },
    {
      title: '适用年龄',
      bodyRender: data => {
        return <span>{getAgeRange(data.minApply, data.maxApply, data.applyType)}</span>;
      },
    },
    {
      title: '开班数',
      bodyRender: data => {
        return <span>{data.classNum}</span>;
      },
    },
  ],
  buildQuery(data) {
    return {
        name: data.search,
        pageNumber: data.page,
        pageSize: 4,
    };
  },
  actions: [
    {
      type: 'search',
      align: 'right',
      placeholder: '课程名称',
    },
  ],
};

/**
 * 教育课程弹窗配置
 */
export default function getEduCourseConfig(options) {
  const basicConfig = getBasicConfig();
  return assign(basicConfig, defaultOptions, options);
}

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
