import React, { FC } from 'react';
import { Form } from '@zent/compat';
const { FormInputField } = Form;

export interface IActivityNameProps {
  activityName: string;
  label: string;
  [index: string]: any;
}

const ActivityNameField: FC<IActivityNameProps> = (props) => {
  const { activityName, label, isView, ...restProps } = props;
  return (
    <FormInputField
      name='activityName'
      disabled={isView}
      width={'250px'}
      placeholder="20个字以内，如：春季入学奖励"
      // className='reward-course-select-wrap'
      label={label}
      required
      value={activityName}
      validations={{ required: true, maxLength: 20 }}
      validationErrors={{ required: '请填写活动名称', maxLength: '最多输入20个字' }}
      {...restProps}
    />
  );
};

export default ActivityNameField;
