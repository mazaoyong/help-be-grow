import React from 'react';
import getUrl from '@youzan/react-components/es/components/choose-dialog/url';
import '@youzan/react-components/es/components/choose-dialog/style';

import Image from '@youzan/ebiz-image';

export default function getConfig(config) {
  let ids = [];
  if (config.cards && config.cards.length > 0) {
    ids = config.cards.map(one => one.id);
  }
  return {
    title: '选择权益',
    needCrossPage: false,
    multiple: true,
    url: `${window._global.url.v4}/vis/pct/benefit/findAvailableBenefitPackagePage.json`,
    renderBatchComponents: () => {
      return null;
    },
    canRowSelect(item) {
      return ids.indexOf(item.id) > -1;
    },
    columns: [
      // 表格
      {
        title: '权益名称',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="member-item-select">
              <div className="member-item-select__cover">
                <Image src={item.cover} alt={item.summary} width="110px" height="62px" />
              </div>
              <div className="member-item-select__content">
                <div className="member-item-select__content__name">{item.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '已关联会员卡',
        bodyRender: item => {
          if ((item.card || {}).alias) {
            return (
              <span className="member-item-select__bind-info">{item.card.name || ''}</span>
            );
          }
          return null;
        },
      },
    ],
    buildQuery(data) {
      return {
        pageNumber: data.page,
        pageSize: 30,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 30,
        page: (data.pageable || {}).pageNumber || 1,
        total: data.total || 0,
      };
    },
    actions: [
      {
        type: 'button',
        align: 'left',
        label: '新建',
        onClick() {
          window.open(`${_global.url.v4}/vis/pct/page/benefit`);
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
    ],
    searchIsNotImplementedYetJiuShiYaoEXinNi: true,
  };
}
