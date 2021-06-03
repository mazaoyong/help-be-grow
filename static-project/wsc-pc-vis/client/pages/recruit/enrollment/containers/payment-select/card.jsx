import React, { cloneElement } from 'react';
import classnames from 'classnames';

export default function PaymentCard({ className, onClick, markId, markName }) {
  const _className = classnames([
    'edu-enrollment-payment-card',
    className,
  ]);
  let icon = '';
  const markArr = markName.split('-');
  const markType = markArr[1] || markArr[0] || '';
  switch (markId) {
    case 1:
      icon = '//img.yzcdn.cn/publicPath/2019/07/02/card.png';
      break;
    case 2:
      icon = '//img.yzcdn.cn/publicPath/2019/07/02/wechat.png';
      break;
    case 3:
      icon = '//img.yzcdn.cn/edu/2019/07/15/payment-alipay.png';
      break;
    default:
      icon = '//img.yzcdn.cn/edu/2019/07/15/payment-custom.png';
      break;
  }
  return (
    <div className={_className} onClick={onClick}>
      <img className="edu-enrollment-payment-card-icon" src={icon} alt="icon"/>
      <div className="edu-enrollment-payment-card-content">
        <div className="edu-enrollment-payment-card-type">{markType}</div>
        <div className="edu-enrollment-payment-card-subtype">标记收款</div>
      </div>
    </div>
  );
}

export function PaymentCardGroup({ value, onChange, children }) {
  const _children = children.map((child, index) => {
    return cloneElement(child, {
      key: index,
      className: value === index ? 'edu-enrollment-payment-card-active' : '',
      onClick: onChange(index, child.props.markId, child.props.markName),
    });
  });
  return (
    <div className="edu-enrollment-payment-card-box" style={{ overflowY: children.length > 9 ? 'scroll' : '' }}>
      <div className="edu-enrollment-payment-card-group">
        {_children}
      </div>
    </div>
  );
}
