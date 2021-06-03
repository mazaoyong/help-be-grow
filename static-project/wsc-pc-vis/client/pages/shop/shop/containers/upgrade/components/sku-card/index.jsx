import React from 'react';
import { Badge } from '@youzan/retail-components';

import './style.scss';

const SkuCard = props => {
  const {
    checked,
    onCheck,
    title,
    actions,
    subTitle,
    price,
    originPrice,
    children,
    className,
    hideIcon,
  } = props;

  const color = checked ? '#155BD4' : '#e5e5e5';

  const badgeProps = {
    color,
    position: 'topRight',
    badgeSize: { width: 20, height: 20 },
    iconWeight: 2,
    iconPosition: { x: 2 },
    onClick: onCheck,
    showIcon: !hideIcon,
  };

  const content = (
    <Badge className={`sku-card ${className}`} {...badgeProps}>
      <div className="sku-card__container">
        <div className="top">
          <div className="top__section">
            <p className="top__title">{title}</p>
            {actions}
          </div>
          {subTitle ? <p className="top__sub-title">{subTitle}</p> : null}
          {children}
        </div>
        <div className="bottom">
          {originPrice ? <span className="bottom__origin-price">{originPrice}</span> : null}
          <span className="bottom__price">{price}</span>
        </div>
      </div>
    </Badge>
  );
  return content;
};

export default SkuCard;
