import React, { Component, PureComponent } from 'react';
import getGroupControl from '../ControlGroup';
import { Input, NumberInput } from 'zent';
import PropTypes from 'prop-types';

class InputStockField extends (PureComponent || Component) {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  render() {
    const { type, ...props } = this.props;
    return (
      <div>
        {type !== 1 ? (
          <NumberInput
            onChange={props.onChange}
            decimal={props.decimal}
            disabled={props.disabled}
            width={props.width}
            addonBefore={props.addonBefore}
            value={props.value === null || props.value === '' ? null : (+props.value).toFixed(props.decimal)}
          />
        ) : (
          <Input
            onChange={props.onChange}
            placeholder={props.placeholder}
            className={props.className}
            width={props.width}
            disabled={props.disabled}
            maxLength={props.maxLength}
            addonBefore={props.addonBefore}
            value={props.value}
          />
        )}
      </div>
    );
  }
}

export default getGroupControl(InputStockField);
