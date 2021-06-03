import { DatePicker } from '@zent/compat';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { subDays } from 'date-fns';
import PickerBtn, { IPickerBtnRef, IPresetItem } from '../picker-btn';
import { SelectedTimeType } from '../../types';
import { useConvertTime } from '../../hooks';

import './style.scss';

export interface ISelectDayProps {
  date: SelectedTimeType;
  onChange: (date: SelectedTimeType) => void;
}

const SelectDay: FC<ISelectDayProps> = ({ date, onChange }) => {
  const values = useConvertTime(date);

  const [rangeTime, chooseIndex] = values;
  const [startTime] = rangeTime;

  const ref = useRef<IPickerBtnRef>({} as IPickerBtnRef);

  const preset: IPresetItem[] = useMemo(() => {
    return [
      {
        text: '今',
        onClick: chooseIndex => {
          onChange([[new Date().getTime()], chooseIndex]);
        },
      },
      {
        text: '昨',
        onClick: chooseIndex => {
          onChange([[subDays(new Date(), 1).getTime()], chooseIndex]);
        },
      },
    ];
  }, [onChange]);

  const handleChange = useCallback(
    value => {
      onChange([[new Date(value).getTime()], undefined]);

      ref.current && ref.current.resetSelectedIndex();
    },
    [onChange],
  );

  return (
    <div className="time-range-picker__day">
      <DatePicker
        format="YYYY年MM月DD日"
        valueType="date"
        canClear={false}
        value={startTime}
        onChange={handleChange}
      />
      <PickerBtn
        ref={ref}
        preset={preset}
        chooseIndex={chooseIndex}
      />
    </div>
  );
};

export default SelectDay;
