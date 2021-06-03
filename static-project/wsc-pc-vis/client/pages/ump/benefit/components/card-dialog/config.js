import React from 'react';
import fullfillImage from 'zan-utils/fullfillImage';
import { COLORCODE } from '../../constants';
// import 'zan-choose-dialog/lib/index.css';
import './style.scss';

const getCover = item => {
  let coverUrl = item.cover;
  let colorCode = item.color;
  if (COLORCODE[colorCode]) {
    coverUrl = coverUrl || COLORCODE[colorCode].imageUrl;
    colorCode = COLORCODE[colorCode].bgColor;
  }
  if (coverUrl) {
    return (
      <div className="benefit-item-select__cover benefit-card__cover">
        <img alt="" src={fullfillImage(coverUrl, '!100x100.jpg')} />
      </div>
    );
  }
  const color = colorCode || 'rgb(99, 179, 89)';
  const style = {
    backgroundColor: color,
  };
  return <div className="benefit-item-select__cover benefit-card__cover" style={style} />;
};

export default function getConfig(config) {
  const canSelectRow = item => {
    return !(item.benefitPackage && item.benefitPackage.id);
  };

  return {
    title: '选择会员卡',
    needCrossPage: false,
    multiple: false,
    // url: getUrl('/ump/paidcontent/benefitPkgVipCards.json', 'www', config.url),
    url: `${_global.url.v4}/vis/pct/benefit/getFindSelectableBenefitCardPage.json`,
    renderBatchComponents: () => {
      return null;
    },
    columns: [
      // 表格
      {
        title: '会员卡名称',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="benefit-item-select">
              {getCover(item)}
              <div className="benefit-item-select__content benefit-card__name">
                <div className="benefit-item-select__content__name">{item.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '已关联会员权益',
        bodyRender: item => {
          if (item.benefitPackage && item.benefitPackage.id) {
            return (
              <span className="benefit-item-select__bind-info">
                已包含权益：
                {item.benefitPackage.name}
              </span>
            );
          }
          return null;
        },
      },
    ],
    canSelectRow,
    buildQuery(data) {
      return {
        pageNumber: data.page,
        pageSize: 30,
        keyword: data.search,
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
    searchIsNotImplementedYetJiuShiYaoEXinNi: true,
  };
}
