import React, { FC } from 'react';
import { Form } from '@zent/compat';
const { FormDateRangePickerField } = Form;

export interface IActivityNameProps {
  activityTime: number[];
  label: string;
  [index: string]: any;
}

const ActivityNameField: FC<IActivityNameProps> = (props) => {
  const { activityTime, label, isView } = props;

  return (
    <FormDateRangePickerField
      disabled={isView}
      name='activityTime'
      // className='reward-course-select-wrap'
      label={label}
      required
      value={activityTime}
      type="split"
      showTime={{ format: 'HH:mm' }}
      min={new Date()}
      dateFormat="YYYY-MM-DD HH:mm:ss"
      validations={{
        required(_, value) {
          return (!!value[0] && !!value[1]);
        },
      }}
      validationErrors={{
        required: '请填写活动时间',
      }}
    />
  );
};

export default ActivityNameField;
