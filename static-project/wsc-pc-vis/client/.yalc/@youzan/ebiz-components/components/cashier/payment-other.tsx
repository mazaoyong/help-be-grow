import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'zent';

import PaymentCard, { PaymentCardGroup } from './components/card';
import { PaymentPrice } from './fragment';
import { IPaymentPayArgs } from './types';

interface IPaymentOtherProps {
  // 价格
  price: number;
  // 订单编号
  orderNo: string;
  // 预支付ID
  prepayId: string;
  // 获取支付方式
  getPayToolsApi: () => Promise<any>;
  // 支付金额
  onPay: (params: IPaymentPayArgs) => void;
  // 关闭弹窗
  onCancel: () => void;
}

interface IPayToolMark {
  id?: number;
  markId: number;
  markName: string;
}

interface IPayToolsDTO {
  payTool: string[];
  payToolTemplateMarkDetailResults: IPayToolMark[]
}

const payToolMap: { [key: number]: string} = {
  1: 'POS_SYMBOl_PAY',
  2: 'WEIXIN_SYMBOl_PAY',
  3: 'ALIPAY_SYMBOl_PAY',
};

export default function PaymentOther(params: IPaymentOtherProps) {
  const { price, orderNo, prepayId, getPayToolsApi, onPay, onCancel } = params;

  console.log(params);

  const [active, setActive] = useState(0);

  const [markId, setMarkId] = useState(2);

  const [markName, setMarkName] = useState('');

  const [methods, setMethods] = useState<IPayToolMark[]>([]);

  const toggleActive = (index: number, newMarkId: number, newMarkName: string) => () => {
    setActive(index);
    setMarkId(newMarkId);
    setMarkName(newMarkName);
  };

  const handlePay = useCallback(() => {

    onPay({
      orderNo,
      prepayId,
      payTool: payToolMap[markId] || 'MARK_PAY',
      customMarkPayName: markName,
    });
  }, [orderNo, prepayId, markId, markName]);

  useEffect(() => {
    getPayToolsApi().then((data: IPayToolsDTO) => {
      const payTools = data.payToolTemplateMarkDetailResults || [];
      const _methods: IPayToolMark[] = [
        {
          markId: 2,
          markName: '标记付款-自有微信支付',
        },
        {
          markId: 3,
          markName: '标记付款-自有支付宝',
        },
        {
          markId: 1,
          markName: '标记付款-自有pos刷卡',
        },
      ].concat(payTools.filter(
        payTool => (payTool.markId !== 1) && (payTool.markId !== 2) && (payTool.markId !== 3)
      ));
      setMethods(_methods);
    });
  }, []);

  return (
    <div>
      <PaymentPrice price={price} />
      <div className="edu-enrollment-payment-card-title">如你已使用以下方式向消费者收款，可以选择对应的标记收款</div>
      <PaymentCardGroup value={active} onChange={toggleActive}>
        {methods.map(({ markId, markName }, index) => (
          <PaymentCard
            key={index}
            markId={markId}
            markName={markName}
          />
        ))}
      </PaymentCardGroup>
      <div className="edu-enrollment-payment-card-tip">标记收款仅用作记账，钱款不计入你的有赞店铺余额，你需要自行向消费者确认已经支付和收款到账。</div>
      <div className="edu-enrollment-payment-btn-group">
        <Button
          className="edu-enrollment-payment-btn"
          type="primary"
          onClick={onCancel}
          outline
        >
            取消收款
        </Button>
        <Button
          className="edu-enrollment-payment-btn"
          type="primary"
          onClick={handlePay}
        >
          确认收款
        </Button>
      </div>
    </div>
  );
}
