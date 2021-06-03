import { DateRangePicker } from '@zent/compat';
import React, { FC } from 'react';

export interface ISelectDayProps {
  date: [Date, Date];
  onChange: (date: any) => void;
}

const SelectDay: FC<ISelectDayProps> = ({ date, onChange }) => {
  return (
    <div className="schedule-select__custom">
      <DateRangePicker
        value={date}
        onChange={onChange}
        valueType="date"
        canClear={false}
      />
    </div>
  );
};

export default SelectDay;
