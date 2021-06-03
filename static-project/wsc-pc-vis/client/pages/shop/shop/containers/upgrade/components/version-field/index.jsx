
import { Form } from '@zent/compat';
/**
 * 软件周期组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatMoney from 'zan-utils/money/format';
import SkuCard from '../sku-card';
import { getVersionData } from './constants';

import './style.scss';

const VERSION_DATA = getVersionData();

class VersionField extends Component {
  static propTypes = {
    value: PropTypes.number,
    handleChange: PropTypes.func,
  };

  componentDidMount() {
    const { value } = this.props;
    // 初始触发一次更新默认选中周期价格
    this.onVersionChange(VERSION_DATA.find(item => item.value === value));
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    const { value } = this.props;
    // value存在被外层更改和重置的可能性，此处特殊检查一下，确保外层价格也是对的
    if (value !== prevProps.value) {
      this.onVersionChange(VERSION_DATA.find(item => item.value === value));
    }
  }

  // 处理卡片选择
  onVersionChange = item => {
    this.props.handleChange(item.value, item.price);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="period-cards">
        {VERSION_DATA.map(item => {
          return (
            <SkuCard
              className="period-cards__card"
              key={item.value}
              checked={item.value === value}
              title={item.title}
              price={`￥ ${formatMoney(item.price, false).replace('.00', '')}`}
              originPrice={item.originPrice && `￥ ${formatMoney(item.originPrice, false).replace('.00', '')}`}
              onCheck={() => this.onVersionChange(item)}
            >
              {item.desc ? <span className="card__desc">{item.desc}</span> : null}
            </SkuCard>
          );
        })}
      </div>
    );
  }
}

export default Form.getControlGroup(VersionField);
