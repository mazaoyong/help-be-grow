import React from 'react';
import '@youzan/react-components/es/components/choose-dialog/style';

import Image from '@youzan/ebiz-image';

export default function getConfig() {
  return {
    title: '选择打卡活动',
    needCrossPage: true,
    multiple: true,
    rowKey: 'alias',
    url: `${_global.url.base}/v4/vis/pct/punch/wym.json`,
    columns: [
      // 表格
      {
        title: '商品',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="punch-item-select">
              <div className="punch-item-select__cover">
                <Image src={item.coverUrl} alt={item.summary} width="98px" height="56px" />
              </div>
              <div className="punch-item-select__content">
                <div className="punch-item-select__content__name">{item.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '状态',
        width: '50%',
        name: 'status',
        bodyRender: item => {
          return item.status === 1 ? '已上架' : '已下架';
        },
      },
    ],
    canSelectRow: rowData => {
      return rowData.status === 1;
    },
    buildQuery(data) {
      return {
        title: data.search,
        page: data.page,
        page_size: 6,
      };
    },
    formatData(data) {
      return {
        data: data.list,
        pageSize: 6,
        total: data.total,
      };
    },
    actions: [
      {
        type: 'button',
        align: 'left',
        label: '新建',
        onClick() {
          window.open(`${_global.url.v4}/vis/pct/page/punch`);
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
      },
    ],
  };
}
