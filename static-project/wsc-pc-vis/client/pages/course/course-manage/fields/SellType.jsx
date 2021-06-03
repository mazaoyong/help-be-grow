
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';
import VersionWrapper from 'fns/version';
import { BlankLink } from '@youzan/react-components';

const { FormRadioGroupField } = Form;
const radioValues = ['体验课', '正式课'];
const helpDescs = {
  0: <span>
    用来低价引流的体验课程，用户报名后，{'"'}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${window._global.url.v4}/vis/edu/page/appointment#/list`}
    >
      预约管理
    </a>
    {'"'}会自动新建一条待确认的预约记录。
  </span>,
  1: <VersionWrapper name='course-manage-courseType'>
    <span>用来正价课程报名使用，若关联适用课程，用户报名后可以看到上课课表、预约课程等。</span>
    <div>用来正价课程报名使用，但无法预约签到消课等，如需排课和预约签到等功能，<BlankLink href={`${_global.url.v4}/subscribe/serve/choose#/`}>可升级到专业版</BlankLink></div>
  </VersionWrapper>,
};

export default class SellType extends Component {
  onCourseTypeChange = e => {
    const { value } = e.target;

    // 切换正式课时，选中收费方式和试用课程默认选项
    if (value === 1) {
      this.props.zentForm.setFieldsValue({
        courseSellType: 1,
        applyCourseType: 2,
        courseType: value,
      });
    } else {
      this.props.zentForm.setFieldsValue({
        courseType: value,
      });
    }
  };

  render() {
    let { label, courseType, isEdit } = this.props;
    return (
      <FormRadioGroupField
        name="courseType"
        label={label}
        value={courseType}
        disabled={isEdit}
        onChange={this.onCourseTypeChange}
        helpDesc={helpDescs[courseType]}
      >
        {radioValues.map((radioValue, radioIndex) => {
          return (
            <Radio key={radioIndex} value={radioIndex}>
              {radioValue}
            </Radio>
          );
        })}
      </FormRadioGroupField>
    );
  }
}
