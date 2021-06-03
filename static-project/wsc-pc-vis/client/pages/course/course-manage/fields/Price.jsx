
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';

const { FormNumberInputField } = Form;

export default class Price extends Component {
  state = { visible: false };
  onVisible = () => {
    if (this.props.disabledMsg) {
      this.setState({ visible: true });
    }
  };
  onInvisible = () => {
    if (this.props.disabledMsg) {
      this.setState({ visible: false });
    }
  };
  render() {
    const { label, price, stocks, disabled, disabledMsg, courseType, courseSellType } = this.props;
    let currPrice = price || 0;
    const tmpStocks = stocks;
    if (tmpStocks.length > 0) {
      currPrice = Math.min.apply(null, tmpStocks.map(item => item.price));
    }
    // fix the number input bug
    return (
      <Pop
        position="top-left"
        block
        content={disabledMsg}
        visible={this.state.visible}
        onVisibleChange={() => {}}
      >
        <FormNumberInputField
          name="price"
          className={cx([
            'input-normal',
            {
              hide: courseType === 1 && courseSellType !== 0,
            },
          ])}
          label={label}
          value={parseFloat(currPrice).toFixed(2)}
          placeholder="请输入价格"
          addonBefore="¥"
          // min={0}
          decimal={2}
          disabled={disabled || stocks.length > 0}
          required
          onMouseOver={this.onVisible}
          onMouseOut={this.onInvisible}
          validations={{
            required(values, value) {
              if (courseType === 0 || (courseType === 1 && courseSellType === 0)) {
                return value !== '';
              }
              return true;
            },
            format(values, value) {
              return value >= 0;
            },
          }}
          validationErrors={{
            required: '请输入价格',
            format: '价格不能为负数',
          }}
        />
      </Pop>
    );
  }
}
