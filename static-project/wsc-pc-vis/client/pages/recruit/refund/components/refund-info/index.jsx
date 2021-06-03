import React from 'react';
import { cent2yuan } from '../../util';

export default function RefundInfo({ refundFeeTypeList, formList }) {
  const totalRefundFee = refundFeeTypeList.reduce((total, refundFeeType) => total + refundFeeType.refundFee || 0, 0);
  if (totalRefundFee === 0) {
    return (
      <div>填写本次退回金额后显示</div>
    );
  }

  const refundListEl = refundFeeTypeList.map((refundFeeType, index) => {
    const {
      refundFee,
      payWayDesc,
      isMark,
      orderNo
    } = refundFeeType || {};
    if (isMark) {
      return (
        <div key={index}>{payWayDesc}将标记-¥{cent2yuan(refundFee, 2)}，请自行以与客户沟通实际退款金额</div>
      );
    }
    return (
      <div key={index}>退回到{payWayDesc}账户¥{cent2yuan(refundFee, 2)}（退款订单：
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={'//www.youzan.com/v4/trade/order/detail?orderNo=' + orderNo}
        >
          {orderNo}
        </a>
      ）</div>
    );
  });

  return (
    <>
      <div>{refundListEl}</div>
      <div className="zent-form__help-desc">实际退款金额，请以跟客户协商的为准</div>
    </>
  );
}
