import React, { useMemo, useCallback, useState } from 'react';
import { Button } from 'zent';
import { PaymentCalculator, PaymentPrice } from './fragment';
import { IPaymentPayArgs } from './types';

interface IPaymentCashProps {
  price: number;
  orderNo: string;
  prepayId: string;
  onPay: (args: IPaymentPayArgs) => void;
  onCancel: () => void;
}

export default function PaymentCash(params: IPaymentCashProps) {
  const { price, orderNo, prepayId, onPay, onCancel } = params;

  const [ payment, setPayment ] = useState(price);

  const handlePay = useCallback(() => {
    onPay({
      orderNo,
      prepayId,
      payTool: 'CASH_PAY',
    });
  }, [orderNo, prepayId]);

  const disabled = useMemo(() => price > payment, [price, payment]);

  return (
    <div>
      <PaymentPrice price={price} />
      <PaymentCalculator price={price} payment={payment} onPaymentChange={setPayment} />
      <div className="edu-enrollment-payment-btn-cash">
        <Button
          className="edu-enrollment-payment-btn"
          disabled={disabled}
          type="primary"
          onClick={handlePay}
        >
          确认收款
        </Button>
      </div>
      <div className="edu-enrollment-payment-btn-cash">
        <Button
          className="edu-enrollment-payment-btn"
          type="primary"
          outline
          onClick={onCancel}
        >
          取消收款
        </Button>
      </div>
    </div>
  );
}
