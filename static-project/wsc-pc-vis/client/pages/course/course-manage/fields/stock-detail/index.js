
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import component from './component';
import './index.scss';

const { Field } = Form;

class StockDetailField extends Component {
  render() {
    const { label, stocks, sku, disabled, disabledMsg, courseType, courseSellType, isStockIndependent } = this.props;
    return (
      <Field
        name="stocks"
        label={label}
        sku={cloneDeep(sku)}
        disabled={disabled}
        isStockIndependent={isStockIndependent}
        disabledMsg={disabledMsg}
        component={component}
        className={cx([
          'stock-field',
          {
            hide: stocks.length === 0 || (courseType === 1 && courseSellType !== 0),
          },
        ])}
        value={stocks}
      />
    );
  }
}

export default StockDetailField;
