
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import Env from '../common/env';

const { FormInputField } = Form;

export default class SellPoint extends Component {
  render() {
    let { label, sellPoint } = this.props;

    return (
      <FormInputField
        name="sellPoint"
        className={cx('form-input-large', { hide: Env.isBaseChildFold() })}
        label={label}
        value={sellPoint}
        maxLength="60"
        autoComplete="off"
        placeholder="请输入课程卖点"
        helpDesc="在课程详情页标题下面展示卖点信息，最多60字"
      />
    );
  }
}
