import { MonthPicker } from '@zent/compat';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { subMonths } from 'date-fns';
import PickerBtn, { IPickerBtnRef, IPresetItem } from '../picker-btn';
import { SelectedTimeType } from '../../types';
import { useConvertTime } from '../../hooks';

import './style.scss';

export interface ISelectMonthProps {
  date: SelectedTimeType;
  onChange: (date: SelectedTimeType) => void;
}

const SelectMonth: FC<ISelectMonthProps> = ({ date, onChange }) => {
  const values = useConvertTime(date);

  const [rangeTime, chooseIndex] = values;
  const [startTime] = rangeTime;

  const ref = useRef<IPickerBtnRef>({} as IPickerBtnRef);

  const preset: IPresetItem[] = useMemo(() => {
    return [
      {
        text: '本月',
        onClick: (chooseIndex) => {
          onChange([[new Date().getTime()], chooseIndex]);
        },
      },
      {
        text: '上月',
        onClick: (chooseIndex) => {
          onChange([[subMonths(new Date(), 1).getTime()], chooseIndex]);
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
    <div className="time-range-picker__month">
      <MonthPicker
        format="YYYY年MM月"
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

export default SelectMonth;
