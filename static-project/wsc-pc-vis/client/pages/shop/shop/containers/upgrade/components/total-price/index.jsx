/**
 * 总价
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export default class TotalPrice extends PureComponent {
  static propTypes = {
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { price, className = '' } = this.props;
    return (
      <div className={`total-price ${className}`}>
        <p className="total-price__price">
          <span className="text">合计：</span>￥{' '}
          <span className="price">{price.replace('.00', '')}</span>
        </p>
        <p className="total-price__desc">优惠计算以下一个页面为准</p>
      </div>
    );
  }
}
