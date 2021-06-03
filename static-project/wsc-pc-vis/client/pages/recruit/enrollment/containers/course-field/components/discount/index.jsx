import { Pop } from '@zent/compat';
import React, { useContext } from 'react';

import Calculator from './calculator';
import Detail from './detail';
import { Context } from '../../../../contexts/price';
import { cent2yuan } from '../../../../util';

import './styles.scss';

export default function Discount({ courses, value }) {
  const {
    state: {
      discountType,
      discount,
      real,
      total,
    },
  } = useContext(Context);
  const _total = cent2yuan(total);
  const _real = cent2yuan(real);
  const _discount = cent2yuan(discount);
  return (
    <div>
      <Calculator />
      <div className="edu-enrollment-discount-show-wrapper">
        <div className="edu-enrollment-discount-show">
          <div className="edu-enrollment-discount-show-detail">
            <span>课程总价</span>
            <span className="edu-enrollment-price-wrapper">{_total}</span>
          </div>
          <div className="edu-enrollment-discount-show-detail">
            <span>
              优惠金额
            </span>
            <span>
              -
              <span className="edu-enrollment-price-wrapper">{_discount}</span>
              {
                discount ? (
                  <Pop
                    trigger="hover"
                    position="top-center"
                    className="edu-enrollment-discount-show-detail-pop"
                    content={
                      <Detail
                        courses={courses}
                        value={value}
                        total={total}
                        discount={discount}
                        discountType={discountType}
                      />
                    }
                  >
                    <a href="javascript: void(0)">明细</a>
                  </Pop>
                ) : null
              }
            </span>
          </div>
          <div className="edu-enrollment-discount-show-total">
            <span>应收总计：</span>
            <span className="edu-enrollment-price-wrapper">{_real}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
