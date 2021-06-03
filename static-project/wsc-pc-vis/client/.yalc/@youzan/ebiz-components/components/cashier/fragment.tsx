import React, { useMemo } from 'react';
import { cent2yuan } from './utils';
import NumberInput from './components/number-input';

interface IPaymentCalculatorProps {
  price: number;
  payment: number;
  onPaymentChange: (val: number) => void;
}

export function PaymentPrice({ price = 0 }) {
  const _price = cent2yuan(price, true);
  return (
    <div className="edu-enrollment-payment-price">
      应收：
      <span className="edu-enrollment-price-wrapper">{_price}</span>
    </div>
  );
}

export function PaymentCalculator({ price = 0, payment, onPaymentChange }: IPaymentCalculatorProps) {
  const change = useMemo(() => {
    const val = payment - price;
    return val > 0 ? val : 0;
  }, [payment, price]);

  return (
    <div className="edu-enrollment-payment-calc">
      <NumberInput value={payment} onChange={onPaymentChange} decimal={2} min={price} placeholder="0.00"/>
      <div className="edu-enrollment-payment-calc-change">
        <span>找零：</span>
        <span className="edu-enrollment-price-wrapper">{cent2yuan(change, true)}</span>
      </div>
    </div>
  );
}
