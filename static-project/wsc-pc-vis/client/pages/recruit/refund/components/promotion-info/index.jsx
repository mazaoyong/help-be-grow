import { Pop } from '@zent/compat';
import React, { Fragment, useMemo } from 'react';
import Big from 'big.js';
import { Icon } from 'zent';
import { cent2yuan } from '../../util';

import './styles.scss';

function PromotionInfoContent({ data }) {
  const renderHeader = header => {
    if (header && header.left && header.right) {
      return (
        <div className="edu-refund-promotion-info-block-header">
          <div>{header.left}</div>
          <div className={header.red ? 'edu-refund-promotion-info-red' : ''}>
            {(header.discount ? '-¥' : '¥') + cent2yuan(header.right, 2)}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderBody = body => {
    if (!body || body.length === 0) {
      return null;
    }
    return body.map((item, index) => (
      <div className="edu-refund-promotion-info-block-body" key={index}>
        <div>{item.left}</div>
        <div>{(item.discount ? '-¥' : '¥') + cent2yuan(item.right, 2)}</div>
      </div>
    ));
  };

  return data.map(({ header, body }, index) => (
    <Fragment key={index}>
      {renderHeader(header)}
      {renderBody(body)}
    </Fragment>
  ));
}

export default function PromotionInfo({ totalPrice, totalOriginPrice, itemPromotionInfoList }) {
  const data = useMemo(() => [
    {
      header: {
        left: '课程原价',
        right: totalOriginPrice,
      },
    },
    {
      header: {
        left: '优惠明细',
        right: totalOriginPrice - totalPrice,
        discount: true,
      },
      body: itemPromotionInfoList.map(({ promotionTypeName, decrease }) => ({
        left: promotionTypeName,
        right: decrease,
        discount: true,
      })),
    },
    {
      header: {
        left: '实付金额',
        right: totalPrice,
        red: true,
      },
    },
  ], [totalPrice, totalOriginPrice, itemPromotionInfoList]);

  if (totalOriginPrice === totalPrice) {
    return null;
  }

  return (
    <Pop
      trigger="hover"
      position="bottom-left"
      className="edu-enrollment-discount-show-detail-pop"
      content={
        <PromotionInfoContent data={data} />
      }
    >
      <div className="edu-refund-promotion-info">
        <span className="edu-refund-promotion-info-trigger">
          {'¥' + Big(totalOriginPrice).div(100).toFixed(2)}
        </span>
        <Icon className="edu-refund-promotion-info-icon" type="error-circle" />
      </div>
    </Pop>
  );
}
