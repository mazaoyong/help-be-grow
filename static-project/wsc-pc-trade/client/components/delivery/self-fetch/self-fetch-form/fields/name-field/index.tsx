import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import './styles.scss';
interface IProps {
  value: string;
  handleNameChanged: React.ChangeEventHandler<HTMLInputElement>;
}

const { FormInputField } = Form;
/**
 * 自提点名称字段
 */
export default class NameField extends PureComponent<IProps> {
  render() {
    return (
      <FormInputField
        required
        label="自提点名称："
        name="name"
        width={460}
        placeholder="请填写自提点名称便于买家理解和管理"
        value={this.props.value}
        onChange={this.props.handleNameChanged}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '自提点名称不能为空',
        }}
      />
    );
  }
}
