
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, LayoutRow as Row } from 'zent';
import TrialCourseSelect from '../trial-course-selector';
const { getControlGroup, FormNumberInputField } = Form;
const RadioGroup = Radio.Group;

class CourseType extends PureComponent {
  onCourseTypeChange = (e) => {
    this.props.onChange(e.target.value);
  }

  getCourseTimeValidations = () => {
    const { value: radioValue, rewardNode, courseProduct, rewardType } = this.props;
    const isSameClassNotEnable = courseProduct.courseSellType % 3 === 0 || rewardNode.rewardNodeType === 3;
    const validations = {};
    validations['required'] = (formatValue, value) => {
      if (rewardType !== 'processing' && !isSameClassNotEnable && radioValue === 1 && !value) {
        return `赠送${courseProduct.courseSellType === 1 ? '课时' : '天'}不能为空`;
      }
      return true;
    };
    return validations;
  }

  render() {
    const { courseProduct, value, givenClassTime, trialCourse, awardType, rewardNode, isView } = this.props;
    const isSameClassNotEnable = courseProduct.courseSellType % 3 === 0 || rewardNode.rewardNodeType === 3;
    return (
      <>
        <RadioGroup
          value={value}
          onChange={this.onCourseTypeChange.bind(this)}
          disabled={isView}
        >
          <Row className='coursetype-row'>
            {isSameClassNotEnable && <Pop trigger='hover' content={rewardNode && rewardNode.rewardNodeType === 3 ? '毕业奖励不支持赠送同一线下课' : '按期、自定义售卖不支持赠送同一线下课'}><div>
              <Radio value={1} disabled={true}>同一线下课</Radio>
            </div></Pop>}
            {!isSameClassNotEnable && <Radio value={1} >同一线下课</Radio>}
            <div className='coursetype-helpdesc'>选择同一线下课赠送，相当于给用户增加线下课时长</div>
          </Row>
          {!isSameClassNotEnable && value === 1 && <div className='givenclasstime-input-wrap'>
            <span>赠送</span>
            <FormNumberInputField
              name='givenClassTime'
              className='givenClassTime'
              width='130px'
              value={givenClassTime}
              disabled={isView}
              min={1}
              max={courseProduct.courseSellType === 1 ? 9999 : 3650}
              addonAfter={courseProduct.courseSellType === 1 ? '课时' : '天'}
              validations={this.getCourseTimeValidations()}
            />
          </div>}
          <Row className='coursetype-row'>
            <Radio value={2}>不同线下课</Radio>
            <div className='coursetype-helpdesc'>获得奖励的用户可免费学习此线下课</div>
          </Row>
        </RadioGroup>
        {value === 2 && <TrialCourseSelect className='trailcourse-selector' awardType={awardType} courseType={value} trialCourse={trialCourse} disabled={isView} />}
      </>
    );
  }
}

export default getControlGroup(CourseType);
