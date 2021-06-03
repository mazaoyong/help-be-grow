import React from 'react';
import fullfillImage from 'zan-utils/fullfillImage';

export default function getConfig(config) {
  let ids = [];
  if (config.cards && config.cards.length > 0) {
    ids = config.cards.map(one => one.id);
  }
  return {
    title: '选择权益',
    needCrossPage: true,
    multiple: true,
    url: `${_global.url.v4}/vis/pct/benefit/getFindBenefitPackagePage.json`,
    renderBatchComponents: data => {
      return <span>已选择 {data.length} 个权益</span>;
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
            <div className="benefit-item-select">
              <div className="benefit-item-select__cover">
                <img alt="" src={fullfillImage(item.cover, '!100x100.jpg')} />
              </div>
              <div className="benefit-item-select__content">
                <div className="benefit-item-select__content__name">{item.name}</div>
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
              <span className="benefit-item-select__bind-info">{item.card.name || ''}</span>
            );
          }
          return null;
        },
      },
    ],
    buildQuery(data) {
      return {
        pageNumber: data.page,
        pageSize: 6,
        keyword: data.search,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 6,
        page: (data.pageable || {}).pageNumber || 1,
        total: data.total || 0,
      };
    },
    searchIsNotImplementedYetJiuShiYaoEXinNi: true,
  };
}
