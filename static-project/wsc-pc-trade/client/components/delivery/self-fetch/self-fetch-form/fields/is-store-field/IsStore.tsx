import React, { Component } from 'react';
import { Checkbox } from 'zent';
import { Form } from '@zent/compat';

export interface IProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}
/**
 * 同时作为门店接待字段组件
 */
class IsStoreComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  onChange = evt => {
    this.props.onChange(evt.target.checked);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="is-store-field">
        <Checkbox checked={value} onChange={this.onChange}>
          同时作为门店接待
        </Checkbox>
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(IsStoreComponent);
