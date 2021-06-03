import React, { useMemo, useEffect } from 'react';

import Tab from './components/tab';
import PaymentAlipayWechat from './payment-alipaywechat';
import PaymentCash from './payment-cash';
import PaymentOther from './payment-other';

import { ICashierProps } from './types';

import './styles.scss';

const Cashier = (props: ICashierProps) => {
  const {
    orderNo,
    price,
    payUrl,
    prePayId,
    getWscQrcodeApi,
    getOrderInfoApi,
    getPayToolsApi,
    onPay,
    onCancel,
  } = props;

  const options = useMemo(() => {
    return [
      {
        text: '支付宝/微信',
        children: (
          <PaymentAlipayWechat
            price={price}
            orderNo={orderNo}
            payUrl={payUrl}
            prepayId={prePayId}
            getWscQrcodeApi={getWscQrcodeApi}
            onPay={onPay}
            onCancel={onCancel}
          />
        ),
      },
      {
        text: '现金支付',
        children: (
          <PaymentCash
            price={price}
            orderNo={orderNo}
            prepayId={prePayId}
            onPay={onPay}
            onCancel={onCancel}
          />
        ),
      },
      {
        text: '其他收款',
        children: (
          <PaymentOther
            price={price}
            orderNo={orderNo}
            prepayId={prePayId}
            getPayToolsApi={getPayToolsApi}
            onPay={onPay}
            onCancel={onCancel}
          />
        ),
      },
    ];
  }, [props]);

  useEffect(() => {
    let timer1: any;
    let timer2: any;

    // after waiting 3s, get order info continually
    timer1 = setTimeout(() => {
      clearTimeout(timer1);
      timer2 = setInterval(() => {
        // drop errors
        getOrderInfoApi({ orderNo })
          .then((data: any) => {
            if (data.mainOrderInfo.payState === 1) {
              clearInterval(timer2);
              window.onbeforeunload = () => {};
              window.location.href = '//www.youzan.com/v4/trade/order/index#/print?from=signUp&orderNo=' + orderNo;
            }
          })
          .catch(() => {});
      }, 1500);
    }, 3000);

    return () => {
      clearInterval(timer2);
    };
  }, [orderNo]);

  return (
    <div className="edu-enrollment-payment-body">
      <Tab options={options} />
    </div>
  );
}

export default Cashier;