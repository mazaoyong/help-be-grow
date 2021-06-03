import React from 'react';
import format from 'date-fns/format';
import baseConfig from './base';

export default function() {
  return baseConfig({
    title: '选择分组',
    url: `${_global.url.base}/v4/vis/course-group/listCourseGroup.json`,
    columns: [
      // 表格
      {
        title: '课程分组',
        width: '50%',
        bodyRender: item => {
          return (
            <a
              href={`https://h5.youzan.com/wscshop/edu/group/${item.alias}?kdtId=${_global.kdtId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          );
        },
      },
      {
        title: '商品数',
        width: '20%',
        name: 'goodsCount',
      },
      {
        title: '创建时间',
        width: '30%',
        name: 'createdTime',
        bodyRender: item => format(item.createdTime, 'YYYY-MM-DD HH:mm:ss'),
      },
    ],
    buildQuery(data) {
      return {
        keyword: data.search,
        pageNumber: data.page,
        pageSize: 8,
        type: 1,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 8,
        total: data.total,
      };
    },
    actions: [
      {
        type: 'button',
        align: 'left',
        label: '课程分组管理',
        onClick() {
          window.open('/v4/vis/edu/page/courseGroup');
        },
      },
      {
        type: 'button',
        align: 'left',
        label: '刷新',
        onClick(evt, context) {
          context.refresh();
        },
      },
      {
        type: 'search',
        align: 'right',
        placeholder: '搜索商品名称',
      },
    ],
  });
}
