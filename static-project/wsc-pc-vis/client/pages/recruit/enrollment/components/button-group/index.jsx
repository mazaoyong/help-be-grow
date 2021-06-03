import React, { useContext } from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import { Context as UserContext } from '../../contexts/user';
import { Context as PriceContext } from '../../contexts/price';
import { cent2yuan } from '../../util';

import './styles.scss';

export default function ButtonGroup() {
  const { state: priceState } = useContext(PriceContext);
  const { state: userState } = useContext(UserContext);
  const orderMode = userState && userState.mode === 'order';
  const price = cent2yuan(priceState.real);
  return (
    <div className="edu-enrollment-button-group">
      应收总计：
      <span className="edu-enrollment-button-group-price edu-enrollment-price-wrapper">{price}</span>
      <SamButton
        name="编辑"
        className="edu-enrollment-button-group-submit"
        type="primary"
        htmlType="submit"
      >
        {orderMode ? '确定' : '收款'}
      </SamButton>
    </div>
  );
}
