import React, { Component } from 'react';
import { Checkbox } from 'zent';
import { Form } from '@zent/compat';

export interface IProps {
  value: boolean; // isOptionSelfFetchTime
  handleIsOptionSelfFetchTimeChanged: (isOptionSelfFetchTime: boolean) => void;
}
/**
 * 需要买家选择自提时间字段组件
 */
class IsOptionComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  onChange = e => {
    this.props.handleIsOptionSelfFetchTimeChanged(e.target.checked);
  };
  render() {
    return (
      <div className="is-option-self-fetch-time-field">
        <Checkbox checked={this.props.value} onChange={this.onChange}>
          需要买家选择自提时间
        </Checkbox>
        <p className="zent-form__help-desc">
          勾选后，买家下单选择上门自提，必须选择自提时间，卖家需要按约定时间备货。
          <br />
          不勾选，将会提示买家尽快到店自提
        </p>
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(IsOptionComponent);
