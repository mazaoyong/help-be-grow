import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import { Radio } from 'zent';
import DropdownList from '../input-dropdownlist';
import './index.scss';
import cx from 'classnames';
import { TIME_LIST } from '../../constants.js';

const { FormRadioGroupField } = Form;

export default class CourseValidateTime extends (PureComponent || Component) {
  getValidation = () => {
    const { courseType, courseSellType, validityPeriodType, validityPeriod } = this.props;
    let validations = {};
    if (courseType && courseSellType === 1 && validityPeriodType === 2) {
      validations = {
        requied() {
          if (!validityPeriod || validityPeriod.range === '' || validityPeriod.range === undefined) {
            return '请填写课时有效时间';
          }
          return true;
        },
        min() {
          if (+validityPeriod.range < 1) {
            return '输入范围1～999';
          }
          return true;
        },
        max() {
          if (+validityPeriod.range > 999) {
            return '输入范围1～999';
          }
          return true;
        },
      };
    }
    return validations;
  };

  render() {
    const { label, courseType, courseSellType, validityPeriodType, validityPeriod } = this.props;
    return (
      <FormRadioGroupField
        name="validityPeriodType"
        label={label}
        value={validityPeriodType || 1}
        validations={this.getValidation()}
        className={cx({
          hide: courseType === 0 || courseSellType !== 1,
        })}
      >
        <div className="course-validate-time-field__line">
          <Radio value={1}>永久有效</Radio>
        </div>
        <div className="course-validate-time-field__line">
          <Radio
            className="course-validate-input-wrap"
            value={2}
            labelStyle={{ display: 'inline-block' }}
          >
            <div className="course-validate-input">
              自生效时间起
              <DropdownList
                className="course-validate-radio-list"
                name="validityPeriod"
                value={validityPeriod}
                dropdownData={TIME_LIST}
                courseSellType={courseSellType}
              />
              内可用
            </div>
          </Radio>
        </div>
      </FormRadioGroupField>
    );
  }
}
