import React from 'react';
import filter from 'lodash/filter';
import some from 'lodash/some';
import fullfillImage from '@youzan/utils/fullfillImage';
import formatMoney from '@youzan/utils/money/format';
import baseConfig from './base';

export default function(config, goodList) {
  return baseConfig({
    title: '选择课程',
    url: `${_global.url.base}/v4/vis/edu/course/getAllCourseList.json`,
    columns: [
      // 表格
      {
        title: '课程商品',
        width: '50%',
        bodyRender: item => {
          const cover = (item.pictureWrapDTO && item.pictureWrapDTO.url) || '';
          return (
            <div className="rc-choose-dialog-paid-goods">
              <div className="rc-choose-dialog-paid-goods--cover">
                <img alt={item.title} src={fullfillImage(cover, '!110x62.jpg')} />
              </div>
              <div className="rc-choose-dialog-paid-goods--desc">
                <a
                  href={item.shortenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rc-choose-dialog-one-line"
                >
                  {item.title}
                </a>
                <div className="rc-choose-dialog-paid-goods--price">
                  ￥{formatMoney(item.price)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '课程类型',
        width: '20%',
        bodyRender({ courseType }) {
          if (courseType === 0) return '体验课';
          if (courseType === 1) return '正式课';
        },
      },
      {
        title: '创建时间',
        width: '30%',
        name: 'createdAt',
        bodyRender: item => {
          return item.createdAt;
        },
      },
    ],
    /* canSelectRow: rowData => {
      return rowData.sellStatus === 0;
    }, */
    buildQuery(data) {
      return {
        title: data.search,
        pageNumber: data.page,
        pageSize: 8,
        soldStatus: 0,
        courseType: data.courseType,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 8,
        total: data.total,
        selected: filter(data.content, item => {
          return some(goodList, { alias: item.alias });
        }),
      };
    },
    actions: [
      {
        type: 'button',
        align: 'left',
        label: '新建',
        onClick() {
          window.open(`${_global.url.v4}/vis/edu/course`);
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
        type: 'select',
        align: 'right',
        field: 'courseType',
        options: [
          {
            label: '全部课程类型',
            value: 2,
          },
          {
            label: '体验课',
            value: 0,
          },
          {
            label: '正式课',
            value: 1,
          },
        ],
      },
      {
        type: 'search',
        align: 'right',
        placeholder: '搜索课程名称',
      },
    ],
  });
}
