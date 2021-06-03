import React, { useEffect } from 'react';
import { Dialog } from 'zent';
import ButtonTab from '../../components/button-tab';
import { PaymentAlipayWechat, PaymentCash, PaymentOther } from './section';

import './styles.scss';
import { getOrderInfo, cancelOrderByNo } from '../../api';
import { YZLocalStorage } from '@youzan/utils';
import { LAST_ORDER_KEY, LAST_ORDER_STUDENT } from '../../constants';

const { openDialog, closeDialog } = Dialog;
const id = 'payment';

function Wrapper({ orderNo, children, onSuccess, onClose }) {
  useEffect(() => {
    let timer1;
    let timer2;

    timer1 = setTimeout(() => {
      clearTimeout(timer1);
      timer2 = setInterval(() => {
        // drop errors
        getOrderInfo({ orderNo }).then(data => {
          if (data.mainOrderInfo.payState === 1) {
            clearInterval(timer2);
            window.onbeforeunload = () => {};
            onClose();
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess();
            }
          }
        }).catch(() => {});
      }, 1500);
    }, 3000);

    return () => {
      clearInterval(timer2);
    };
  }, [orderNo]);
  return children;
}

export default function openPaymentSelect(props) {
  const onClose = () => {
    closeDialog(id);
  };
  const options = [
    {
      text: '支付宝/微信',
      children: <PaymentAlipayWechat {...props} onClose={onClose} />,
    },
    {
      text: '现金支付',
      children: <PaymentCash {...props} onClose={onClose} />,
    },
    {
      text: '其他收款',
      children: <PaymentOther {...props} onClose={onClose} />,
    },
  ];

  const lastOrderNo = YZLocalStorage.getItem(LAST_ORDER_KEY);
  const lastOrderStudent = YZLocalStorage.getItem(LAST_ORDER_STUDENT);
  if (lastOrderNo && (Number(props.studentId) === Number(lastOrderStudent) || !props.studentId)) {
    cancelOrderByNo({
      fromOpen: false,
      orderNo: lastOrderNo,
    }).catch(() => {}).finally(() => {
      YZLocalStorage.removeItem(LAST_ORDER_KEY);
      if (lastOrderStudent) {
        YZLocalStorage.removeItem(LAST_ORDER_STUDENT);
      }
    });
  }

  openDialog({
    dialogId: id,
    title: '收款',
    className: 'edu-enrollment-payment',
    maskClosable: false,
    onClose: () => {
      // doesn't cancel order after closing, instead, cancel before creating a new order
      YZLocalStorage.setItem(LAST_ORDER_KEY, props.orderNo);
      if (props.studentId) {
        YZLocalStorage.setItem(LAST_ORDER_STUDENT, props.studentId);
      }
    },
    children: (
      <div className="edu-enrollment-payment-body">
        <ButtonTab
          options={options}
          wrapper={Wrapper}
          orderNo={props.orderNo}
          onClose={onClose}
          {...props}
        />
      </div>
    ),
  });
}
