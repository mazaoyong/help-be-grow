
import { Form } from '@zent/compat';
import React, { FC } from 'react';
import { HolidaySelect } from './holiday-select';
import { CustomHolidayData } from '../../../../edu-admin/api/holiday';

const { Field } = Form;

interface HolidaySelectFieldProps {
  isCreate?: boolean;
  queryKdtId?: number;
  visible?: boolean;
  name: string;
  value: CustomHolidayData[];
  displayError?: boolean;
}

export const HolidaySelectField: FC<HolidaySelectFieldProps> = (props) => {
  return <Field {...props} component={HolidaySelect} />;
};
