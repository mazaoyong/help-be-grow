import React, { useContext } from 'react';
import { Alert, Affix } from 'zent';
import { Context as UserContext } from '../../contexts/user';
import { Context as PriceContext } from '../../contexts/price';
import { cent2yuan } from '../../util';

export default function Warning() {
  const { state: userState } = useContext(UserContext);

  const { state: priceState, orderDiffPrice } = useContext(PriceContext);

  const orderMode = userState && userState.mode === 'order';

  const targetPrice = cent2yuan(priceState.targetPrice);
  const selectedPrice = cent2yuan(priceState.real);

  if (orderMode && targetPrice) {
    return (
      <div className="edu-enrollment-affix">
        <Affix offsetTop={16} >
          <Alert type="warning" className="edu-enrollment-warning">
            {
              orderDiffPrice <= 0 ? <span>本单已收款{targetPrice}元，应收总计金额需等于{targetPrice}元才可保存。</span>
                : <span>
                  本单已收款{targetPrice}元，当前选课金额{selectedPrice}元，共需要设置优惠{orderDiffPrice}元才可保存。
                </span>
            }
          </Alert>
        </Affix>
      </div>
    );
  }
  return null;
}
