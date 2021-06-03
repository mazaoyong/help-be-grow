import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from 'zent';
import { PaymentPrice } from './fragment';
import { IPaymentPayArgs } from './types';

interface IPaymentAlipayWechatProps {
  price: number;
  orderNo: string;
  payUrl: string;
  prepayId: string;
  getWscQrcodeApi: (args: { url: string, width: number, height: number }) => Promise<string>;
  onPay: (args: IPaymentPayArgs) => void;
  onCancel: () => void;
}

export default function PaymentAlipayWechat({ price, orderNo, payUrl, prepayId, getWscQrcodeApi, onPay, onCancel }: IPaymentAlipayWechatProps) {
  const [qrcode, setQrcode] = useState('');
  const [visible, setVisible] = useState(false);

  const popRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const toggleVisible = useCallback(() => {
    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    getWscQrcodeApi({
      url: payUrl,
      width: 230,
      height: 230,
    })
      .then((curQrCode: string) => {
        setQrcode(curQrCode);
      });
  }, [payUrl]);

  useEffect(() => {
    const hideQrcode = (e: MouseEvent) => {
      if (
        (!visible) ||
        (popRef.current && popRef.current.contains(e.target as Node)) ||
        (btnRef.current && btnRef.current.contains(e.target as Node))
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
    const onKeyPress = (e: KeyboardEvent) => {
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
        if (!str) {
          return;
        }

        onPay({
          authCode,
          orderNo,
          prepayId,
          payTool: 'BARCODE',
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
            <img src="//su.yzcdn.cn/publicPath/2019/07/15/qrcode.png" />
            客户扫码付款
          </>
        </Button>
      </div>
    </div>
  );
}
