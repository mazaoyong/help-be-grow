
import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { Radio } from 'zent';
import cx from 'classnames';

const { FormRadioGroupField } = Form;

export default class EduCourseApplyType extends (PureComponent || Component) {
  render() {
    const { applyCourseType, label, courseType, isEdit, courseSellType, isFromOldCustomer } = this.props;
    return (
      <FormRadioGroupField
        name="applyCourseType"
        label={label}
        value={applyCourseType}
        disabled={!isFromOldCustomer && isEdit}
        className={cx({
          hide: courseType === 0 || courseSellType === 3,
        })}
        required
        validations={{
          required: (_, value) => {
            if (!value && courseType === 1 && courseSellType !== 3) {
              return '请输入适用课程类型';
            }
            return true;
          },
        }}
      >
        <Radio value={2}>
          <span>指定课程</span>
        </Radio>
        <Radio value={1}>
          <span>全部课程</span>
        </Radio>
      </FormRadioGroupField>
    );
  }
}
