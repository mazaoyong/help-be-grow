import React, { PureComponent, ChangeEvent } from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';
import unknownProps from './unknown-props';
import { yuan2cent, cent2yuan } from '../../utils';

export default class NumberInput extends PureComponent<any, any> {
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.value !== prevState.preValue) {
      return {
        preValue: nextProps.value,
        value: cent2yuan(nextProps.value, true),
      };
    }
    return null;
  }

  state = {
    value: '',
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  handleBlur = () => {
    const { max, min, onChange, onBlur } = this.props;
    const { value } = this.state;

    const hasMax = Boolean(max);
    const hasMin = Boolean(min);

    let str = Number(value).toFixed(2);
    let val = yuan2cent(value);

    if (hasMax && (yuan2cent(value) > max)) {
      str = cent2yuan(max, true);
      val = max;
    }

    if (hasMin && (yuan2cent(value) < min)) {
      str = cent2yuan(min, true);
      val = min;
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
    const { value } = this.state;
    const passableProps = omit(this.props, unknownProps);
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
