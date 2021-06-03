import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button, Notify, Dialog } from 'zent';

import { PaymentPrice, PaymentCalculator } from './price';
import { getWscQrcode, pay, getPayToolsByEduKdtId } from '../../api';
import PaymentCard, { PaymentCardGroup } from './card';
import accMul from '@youzan/utils/number/accMul';
import { cent2yuan } from '../../util';

const dialogId = 'payment';
const { closeDialog } = Dialog;

function payAndRedirect(params) {
  pay(params).then(() => {
    window.onbeforeunload = () => {};
    if (params.onSuccess && typeof params.onSuccess === 'function') {
      params.onSuccess();
    }
    params.onClose();
  }).catch((err) => {
    Notify.error(err);
  });
}

export function PaymentAlipayWechat({ price, orderId, orderNo, payUrl, prepayId, onSuccess, onClose }) {
  const [qrcode, setQrcode] = useState();
  const [visible, setVisible] = useState();

  const popRef = useRef(null);
  const btnRef = useRef(null);

  const toggleVisible = useCallback(e => {
    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    closeDialog(dialogId);
  }, []);

  useEffect(() => {
    getWscQrcode({
      url: payUrl,
      width: 230,
      height: 230,
    }).then(curQrcode => {
      setQrcode(curQrcode);
    });
  }, [payUrl]);

  useEffect(() => {
    const hideQrcode = e => {
      if (
        (!visible) ||
        (popRef.current && popRef.current.contains(e.target)) ||
        (btnRef.current && btnRef.current.contains(e.target))
      ) {
        return;
      }
      setVisible(false);
    };
    document.addEventListener('click', hideQrcode);
    return () => {
      document.removeEventListener('click', hideQrcode);
    };
  }, [visible]);

  useEffect(() => {
    let str = '';
    let preTime = 0;
    const onKeyPress = e => {
      if (visible) {
        return;
      }
      const code = e.which;

      if (preTime) {
        const curTime = Date.now();
        // if signal not received from scanner
        if (curTime - preTime > 30) {
          str = '';
          preTime = 0;
          return;
        }
        preTime = curTime;
      } else {
        preTime = Date.now();
      }

      if (code === 13) {
        const authCode = str;
        payAndRedirect({
          authCode,
          orderNo,
          prepayId,
          payTool: 'BARCODE',
          onSuccess,
          onClose
        });
        str = '';
        preTime = 0;
        return;
      }

      str += String.fromCharCode(code);
    };
    document.addEventListener('keypress', onKeyPress);
    return () => {
      document.removeEventListener('keypress', onKeyPress);
    };
  }, [visible, orderNo, prepayId]);

  return (
    <div className="edu-enrollment-payment-alipay-wechat">
      <PaymentPrice price={price} />
      {
        visible ? (
          <div className="edu-enrollment-payment-qrcode" ref={popRef}>
            <img src={qrcode} alt=""/>
          </div>
        ) : null
      }
      <img
        className="edu-enrollment-payment-scan"
        src="//img.yzcdn.cn/publicPath/2019/06/30/qr-scan.png"
        alt="QR_SCAN"
      />
      <div className="edu-enrollment-payment-scan-tips">使用扫码枪扫描客户付款码</div>
      <div ref={btnRef}>
        <Button
          className="edu-enrollment-payment-btn"
          type="primary"
          onClick={handleCancel}
          outline>取消收款</Button>
        <Button
          className="edu-enrollment-payment-btn"
          type="primary"
          onClick={toggleVisible}
        >
          <>
            <img src="//b.yzcdn.cn/publicPath/2019/07/15/qrcode.png" />
            客户扫码付款
          </>
        </Button>
      </div>
    </div>
  );
}

export function PaymentCash({ price, orderId, orderNo, payUrl, prepayId, onSuccess, onClose }) {
  const [ payment, setPayment ] = useState(cent2yuan(price));
  const handlePay = useCallback(() => {
    payAndRedirect({
      orderNo,
      prepayId,
      payTool: 'CASH_PAY',
      onSuccess,
      onClose
    });
  }, [orderNo, prepayId]);
  const handleCancel = useCallback(() => {
    closeDialog(dialogId);
  }, []);
  const disabled = useMemo(() => price > accMul(payment, 100), [price, payment]);
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
          onClick={handleCancel}
        >
          取消收款
        </Button>
      </div>
    </div>
  );
}

export function PaymentOther({ price, orderId, orderNo, payUrl, prepayId, onSuccess, onClose }) {
  const [active, setActive] = useState(0);
  const [markId, setMarkId] = useState(2);
  const [markName, setMarkName] = useState('');
  const [methods, setMethods] = useState([]);
  const handleActiveChange = (index, newMarkId, newMarkName) => () => {
    setActive(index);
    setMarkId(newMarkId);
    setMarkName(newMarkName);
  };
  const handleCancel = useCallback(() => {
    closeDialog(dialogId);
  }, []);
  const handlePay = useCallback(() => {
    const payToolMap = {
      1: 'POS_SYMBOl_PAY',
      2: 'WEIXIN_SYMBOl_PAY',
      3: 'ALIPAY_SYMBOl_PAY',
    };
    payAndRedirect({
      orderNo,
      prepayId,
      payTool: payToolMap[markId] || 'MARK_PAY',
      customMarkPayName: markName,
      onSuccess,
      onClose
    }, []);
  }, [orderNo, prepayId, markId, markName]);
  useEffect(() => {
    getPayToolsByEduKdtId().then(data => {
      const payTools = data.payToolTemplateMarkDetailResults || [];
      const _methods = [
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
      <PaymentCardGroup value={active} onChange={handleActiveChange}>
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
          onClick={handleCancel}
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
