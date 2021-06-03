
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';
import helpPopupTips from '../components/help-popup-tips';
import { COURSE_SELL_GROUP, COURSE_SELL_TYPE_TIPS } from '../constants';
import cx from 'classnames';
import VersionWrapper from 'fns/version';
const { FormRadioGroupField } = Form;

export default class CourseSellType extends Component {
  render() {
    const { courseType, label, courseSellType, isEdit } = this.props;
    return (
      <FormRadioGroupField
        name="courseSellType"
        label={label}
        value={courseSellType}
        disabled={isEdit}
        className={cx({
          hide: courseType === 0,
        })}
      >
        {COURSE_SELL_GROUP.map((courseSellOption, courseSellIndex) => {
          if (courseSellOption === '按期') {
            return (
              <VersionWrapper key={courseSellIndex} name='course-manage-courseSellType' downgrade={{
                from: courseSellType === 3,
              }}>
                <Radio value={(courseSellIndex + 1) % 4}>
                  <span>{courseSellOption}</span>
                  {helpPopupTips(COURSE_SELL_TYPE_TIPS[courseSellIndex])}
                </Radio>
              </VersionWrapper>
            );
          }
          return (
            <Radio key={courseSellIndex} value={(courseSellIndex + 1) % 4}>
              <span>{courseSellOption}</span>
              {helpPopupTips(COURSE_SELL_TYPE_TIPS[courseSellIndex])}
            </Radio>
          );
        })}
      </FormRadioGroupField>
    );
  }
}
