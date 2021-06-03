
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import { Radio, LayoutRow as Row } from 'zent';
import component from './component';
import cx from 'classnames';
import './index.scss';
import VersionWrapper from 'fns/version';
const { Field, FormRadioGroupField } = Form;

export default class CourseEnableTime extends (PureComponent || Component) {
  getValidation = () => {
    const {
      courseEffectiveType,
      courseType,
      courseSellType,
      validityPeriodType,
      courseEffectiveDelayDays,
    } = this.props;
    let validations = {};
    if (
      courseType &&
      courseEffectiveType === 2 &&
      (
        (courseSellType === 1 && validityPeriodType === 2) ||
        courseSellType === 2
      )
    ) {
      validations = {
        requied: (_, value) => {
          if (!courseEffectiveDelayDays) {
            return '生效时间必须填写，输入范围1～999';
          }
          return true;
        },
        min: (_, value) => {
          if (+courseEffectiveDelayDays < 1) {
            return '生效时间必须填写，输入范围1～999';
          }
          return true;
        },
        max: (_, value) => {
          if (+courseEffectiveDelayDays > 999) {
            return '生效时间必须填写，输入范围1～999';
          }
          return true;
        },
      };
    }
    return validations;
  }

  render() {
    const {
      label,
      courseEffectiveType,
      courseEffectiveDelayDays,
      courseType,
      courseSellType,
      validityPeriodType,
      applyCourse = {},
      isEdit,
    } = this.props;
    return (
      <FormRadioGroupField
        name="courseEffectiveType"
        label={label}
        value={courseEffectiveType || 3}
        validations={this.getValidation()}
        className={cx('course-effective-type', {
          hide: courseType === 0 ||
            courseSellType === 3 ||
            courseSellType === 0 ||
            (courseSellType === 1 && validityPeriodType === 1),
        })}
      >
        <Row>
          <VersionWrapper name='course-manage-effectDays' downgrade={{ from: isEdit }}>
            {applyCourse.isRelatedEduCourse && <Radio value={1}>首次上课签到后生效</Radio>}
          </VersionWrapper>
        </Row>
        <Row>
          <Radio className="course-enable-time-wrap" value={2}>
            <Field
              name="courseEffectiveDelayDays"
              component={component}
              value={courseEffectiveDelayDays}
            />
          </Radio>
        </Row>
        <Row>
          <Radio value={3}>付款完成后立即生效</Radio>
        </Row>
      </FormRadioGroupField>
    );
  }
}
