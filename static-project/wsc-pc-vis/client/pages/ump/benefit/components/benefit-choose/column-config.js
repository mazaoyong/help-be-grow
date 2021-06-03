import React from 'react';
import { Tag } from 'zent';
import { format } from 'date-fns';
import { Img } from '@youzan/ebiz-components';
// import 'zan-choose-dialog/lib/index.css';
const { ImgWrap } = Img;
export default function getConfig(config) {
  const canSelectRow = data => {
    return !data.is_in_benefit && data.columnType === 0;
  };

  return {
    title: '专栏',
    needCrossPage: true,
    multiple: true,
    url: `${_global.url.v4}/vis/pct/benefit/getFindSelectableBenefitItemPage.json`,
    renderBatchComponents: data => {
      return <span>已选择 {data.length} 个专栏</span>;
    },
    columns: [
      // 表格
      {
        title: '专栏名称',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="benefit-item-select">
              <div className="benefit-item-select__cover">
                <ImgWrap width="75px" height="42px" src={item.cover} fullfill="!100x100.jpg" />
              </div>
              <div className="benefit-item-select__content">
                <div className="benefit-item-select__content__name">
                  {item.title}
                  {item.columnType === 1 && (
                    <div className="benefit-item-select__content__tag">
                      <Tag color="#4b0">分销</Tag>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '创建时间',
        name: 'publishAt',
      },
    ],
    canSelectRow,
    buildQuery(data) {
      return {
        type: 1,
        pageNumber: data.page,
        pageSize: 6,
        keyword: data.search,
        alias: config.alias,
      };
    },
    formatData(data) {
      (data.content || []).forEach(item => {
        item.publishAt = format(item.publishAt, 'YYYY-MM-DD HH:mm:ss');
      });
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
