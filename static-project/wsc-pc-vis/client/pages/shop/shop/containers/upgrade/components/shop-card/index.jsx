import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@youzan/retail-components';

import './style.scss';

const SHOP_STATUS = {
  valid: '有效期',
  try: '试用期',
  protect: '保护期',
  close: '已打烊',
  pause: '已歇业',
  undefined: '未激活',
};

const shopCard = props => {
  const { checked, data, onCheck } = props;

  let text = '';
  if (!data.expiredTime) {
    text = `店铺状态：${SHOP_STATUS[data.lifeCycleStatus]}`;
  } else if (data.lifeCycleStatus === 'try') {
    text = `试用期至：${format(data.expiredTime, 'YYYY年MM月D日')}`;
  } else {
    text = `有效期至：${format(data.expiredTime, 'YYYY年MM月D日')}`;
  }

  const color = checked ? '#155BD4' : '#e5e5e5';
  // const borderWidth = checked ? 2 : 1;
  const borderWidth = 1;

  const badgeProps = {
    color,
    position: 'topRight',
    iconWeight: 2,
    borderWidth,
    onClick: onCheck,
  };

  const content = (
    <Badge className="shop-card" {...badgeProps}>
      <div className="shop-card__container">
        <p className="shop-name">{data.shopName}</p>
        <div className="shop-info">
          <p>
            主体信息：
            {data.subjectName.length ? data.subjectName : '未认证'}
          </p>
          <p>{text}</p>
        </div>
      </div>
    </Badge>
  );
  return content;
};

export default shopCard;
