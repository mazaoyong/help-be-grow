
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import component from './component';
import './index.scss';

const { Field } = Form;

export default class Limit extends Component {
  onChangeDate() {}

  render() {
    const { label, quota, disabled, disabledMsg } = this.props;

    return (
      <Field
        name="quota"
        value={quota}
        label={label}
        disabled={disabled}
        disabledMsg={disabledMsg}
        component={component}
        asyncValidation={(_, value) => new Promise((resolve, reject) => {
          if (value === null) return resolve(); // 未勾选限购
          if (value === '') return reject('请输入限购次数');
          if (value < 1) return reject('限购次数必须不小于1');
          if (value > 99999) return reject('限购次数不能超过99999');
          return resolve();
        })}
      />
    );
  }
}
