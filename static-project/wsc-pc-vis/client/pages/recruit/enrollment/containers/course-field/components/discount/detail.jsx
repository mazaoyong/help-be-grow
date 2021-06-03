import React from 'react';

import { computeSkuStr, cent2yuan } from '../../../../util';
import accAdd from '@youzan/utils/number/accAdd';
import accSub from '@youzan/utils/number/accSub';

function DetailTitle({ title, price }) {
  return (
    <div className="edu-enrollment-discount-detail-title">
      <div>{title}</div>
      <div>
        -
        <span className="edu-enrollment-price-wrapper">{cent2yuan(price)}</span>
      </div>
    </div>
  );
}

function DetailRow({ title, sku, price }) {
  return (
    <div className="edu-enrollment-discount-detail-row">
      <div className="edu-enrollment-discount-detail-row-key">
        <div>{title}</div>
        {sku ? <div className="edu-enrollment-discount-detail-row-sku">{sku}</div> : null}
      </div>
      <div className="edu-enrollment-discount-detail-row-value edu-enrollment-price-wrapper">{cent2yuan(price)}</div>
    </div>
  );
}

export default function Detail({ courses, value, total, discount, discountType }) {
  const courseDiscounts = courses.map((item, index) => {
    const data = value[index];
    const _sku = item.productSkuDTOList && item.productSkuDTOList.find(curSku => curSku.id === data.skuId);
    const skuStr = computeSkuStr(_sku);
    return {
      title: item.course.title,
      price: accSub(data.price, data.realPrice),
      sku: skuStr,
    };
  });
  const totalDiscountByEach = courseDiscounts.reduce((discountByEach, courseDiscount) => {
    return accAdd(discountByEach, courseDiscount.price);
  }, 0);
  const totalDiscountByAll = accSub(discount, totalDiscountByEach);
  return (
    <div>
      {
        totalDiscountByEach ? (
          <>
            <DetailTitle title="单品减价" price={totalDiscountByEach} />
            {
              courseDiscounts
                .filter(courseDiscount => courseDiscount.price)
                .map((courseDiscount, index) => (
                  <DetailRow key={index} {...courseDiscount} />
                ))
            }
          </>
        ) : null
      }
      {
        totalDiscountByAll ? (
          <DetailTitle
            title={discountType === 1 ? '整单减价' : '整单折扣'}
            price={totalDiscountByAll}
          />
        ) : null
      }
    </div>
  );
}
