
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';
import unknownProps from 'components/form/unknown-props';

const { getControlGroup } = Form;

export default class NumberInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.preValue) {
      return {
        preValue: nextProps.value,
        value: nextProps.value,
      };
    }
    return null;
  }

  state = {
    value: '',
  }

  handleChange = e => {
    const { decimal } = this.props;

    let regExp = /^[0-9]*(\.)?([0-9]*)?$/;
    if (decimal === 0) {
      regExp = /^[0-9]*$/;
    }

    if (decimal && decimal > 0) {
      regExp = new RegExp(`^[0-9]*(\\.)?([0-9]{0,${decimal}})?$`);
    }

    if (regExp.test(e.target.value)) {
      this.setState({ value: e.target.value });
    }
  };

  handleBlur = e => {
    const { max, min, onChange, onBlur } = this.props;
    const { value } = this.state;

    const hasMax = /^[.0-9]*$/.test(String(max));
    const hasMin = /^[.0-9]*$/.test(String(min));

    let str = String(value);
    let val = Number(value);

    if (hasMax && (Number(value) > Number(max))) {
      str = String(max);
      val = Number(max);
    }

    if (hasMin && (Number(value) < Number(min))) {
      str = String(min);
      val = Number(min);
    }

    this.setState({ value: str });

    if (onChange) {
      onChange(val);
    }

    if (onBlur) {
      onBlur(val);
    }
  };

  render() {
    const { decimal, max, onChange, preValue, ...restProps } = this.props;
    const { value } = this.state;

    const passableProps = omit(restProps, unknownProps);
    return (
      <Input
        {...passableProps}
        value={value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

export const NumberInputField = getControlGroup(NumberInput);
