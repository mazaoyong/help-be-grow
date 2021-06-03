
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import component from './component';
import './index.scss';
const { Field } = Form;

class CourseSelectorWrap extends PureComponent {
  getRequiredValidation = (errorMessage) => {
    const { rewardType } = this.props;
    const vaidations = {};
    vaidations['required'] = (formValue, value) => {
      if (value.alias === '' && rewardType !== 'processing') {
        return errorMessage;
      }
      return true;
    };
    return vaidations;
  }

  render() {
    const { courseProduct, label, ...props } = this.props;
    return (
      <Field
        name='courseProduct'
        className='reward-course-select-wrap'
        label={label}
        required
        component={component}
        value={courseProduct}
        validations={this.getRequiredValidation('请选择线下课')}
        {...props}
      />
    );
  }
}

export default CourseSelectorWrap;
