import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import './styles.scss';
interface IProps {
  value: string;
  onChange: (value: string) => void;
}

const { FormInputField } = Form;
/**
 * 自提点名称字段
 */
export default class DescriptionField extends PureComponent<IProps> {
  onChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    return (
      <FormInputField
        type="textarea"
        label="商家推荐："
        name="description"
        className="description-field"
        width={460}
        maxLength={200}
        placeholder="可以描述自提点的活动或相关备注信息（最多200个字）"
        value={this.props.value}
        onChange={this.onChange}
      />
    );
  }
}
