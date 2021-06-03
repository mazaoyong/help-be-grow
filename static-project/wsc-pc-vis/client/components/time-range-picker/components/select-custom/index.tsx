import React, { FC, useCallback } from 'react';
import { DateRangeQuickPicker } from 'zent';
import { useConvertTime } from '../../hooks';
import { SelectedTimeType } from '../../types';
import { PRESET } from '../../constants';

import './style.scss';

export interface ISelectCustomProps {
  date: SelectedTimeType;
  onChange: (date: SelectedTimeType) => void;
}

const SelectCustom: FC<ISelectCustomProps> = ({ date, onChange }) => {
  const values = useConvertTime(date) as any;

  const handleChange = useCallback((value, chooseDays) => {
    const [st, et] = value;
    const rangeTime: number[] = [];

    rangeTime[0] = st && new Date(st).getTime();
    rangeTime[1] = et && new Date(et).getTime();

    onChange([rangeTime, chooseDays]);
  }, [onChange]);

  return (
    <div className="time-range-picker__custom">
      <DateRangeQuickPicker
        preset={PRESET}
        value={values[0]}
        chooseDays={values[1]}
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectCustom;
