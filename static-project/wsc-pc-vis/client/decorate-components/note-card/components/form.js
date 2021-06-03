import React from 'react';
import { Form } from '@zent/compat';

const { FormInputField, createForm } = Form;
class TitleInput extends React.Component {
  render() {
    return (
      <Form>
        <FormInputField
          name="pageTitle"
          type="text"
          onChange={this.props.onChange}
          value={this.props.value}
          validations={{
            require(values, value) {
              return value.length <= 8;
            },
          }}
          validationErrors={{
            required: '请输入不超过8个字专题名称',
          }}
        />
      </Form>
    );
  }
}
const FromInput = createForm()(TitleInput);
export default FromInput;
