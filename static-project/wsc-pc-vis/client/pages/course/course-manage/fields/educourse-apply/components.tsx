import React, { FC, useCallback } from 'react';
import { Checkbox, Radio } from 'zent';
import { Form, IFormControlGroupProps } from '@zent/compat';
import { IEduCourseApplyProps } from './types';
import get from 'lodash/get';
import EduCourseSelector from './related2educourse';

const { getControlGroup } = Form;

const EduCourseApplyField: FC<IEduCourseApplyProps & IFormControlGroupProps> = props => {
  const { value, onChange = () => {}, disabled = false, courseSellType } = props;

  const onRelatedCourseChange = useCallback(
    e => {
      onChange({ ...value, isRelatedEduCourse: e.target.checked });
    },
    [value],
  );

  const onApplyTypeChange = useCallback(
    e => {
      onChange({ ...value, applyCourseType: e.target.value });
    },
    [value],
  );

  return (
    <div className={'educourse_apply_wrap'}>
      {courseSellType !== 3 ? (
        <>
          <div>
            <Checkbox
              disabled={disabled}
              checked={get(value, 'isRelatedEduCourse')}
              onChange={onRelatedCourseChange}
            >
              开启
            </Checkbox>
            <div className={'educourse_apply__desc'}>
              若关联适用课程，学员生效后可以查看对应课程的课表和预约课程等。
            </div>
          </div>
          {get(value, 'isRelatedEduCourse') && (
            <div className="educourse_apply__type">
              <Radio.Group
                className="educourse_apply__educoursegroup"
                disabled={disabled}
                value={get(value, 'applyCourseType')}
                onChange={onApplyTypeChange}
              >
                <Radio value={2}>指定课程</Radio>
                <Radio value={1}>全部课程</Radio>
              </Radio.Group>
              {get(value, 'applyCourseType') === 2 && (
                <div className="educourse-field">
                  <EduCourseSelector {...props} />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="educourse-field">
          <EduCourseSelector {...props} />
        </div>
      )}
    </div>
  );
};

export default getControlGroup(EduCourseApplyField);
