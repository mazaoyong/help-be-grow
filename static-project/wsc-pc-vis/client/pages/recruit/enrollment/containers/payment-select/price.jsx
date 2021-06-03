import React, { useMemo } from 'react';
import { NumberInput } from 'zent';
import { yuan2cent, cent2yuan } from '../../util';

export function PaymentPrice({ price = 0 }) {
  const _price = cent2yuan(price);
  return (
    <div className="edu-enrollment-payment-price">
      应收：
      <span className="edu-enrollment-price-wrapper">{_price}</span>
    </div>
  );
}

export function PaymentCalculator({ price = 0, payment, onPaymentChange }) {
  const change = useMemo(() => {
    const _change = yuan2cent(payment) - price;
    return _change > 0 ? _change : 0;
  }, [payment, price]);
  const handlePaymentChange = v => {
    onPaymentChange(Number(v));
  };
  return (
    <div className="edu-enrollment-payment-calc">
      <NumberInput value={payment} onChange={handlePaymentChange} decimal={2} placeholder="0.00"/>
      <div className="edu-enrollment-payment-calc-change">
        <span>找零：</span>
        <span className="edu-enrollment-price-wrapper">{cent2yuan(change)}</span>
      </div>
    </div>
  );
}
