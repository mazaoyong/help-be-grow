
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import component from './component';
import './index.scss';
const { Field } = Form;

class TrialCourseSelectorWrap extends PureComponent {
  getRequiredValidation = () => {
    const validations = {};
    const { awardType, courseType } = this.props;
    if (awardType === 3 && courseType === 2) {
      validations['required'] = (_, value) => {
        if (!value || !value.alias) {
          return '请选择赠送线下课';
        }
        return true;
      };
    }
    return validations;
  }

  render() {
    const { trialCourse, ...props } = this.props;
    return <Field
      name='trialCourse'
      component={component}
      value={trialCourse}
      validations={this.getRequiredValidation()}
      {...props}
    />;
  }
}

export default TrialCourseSelectorWrap;
