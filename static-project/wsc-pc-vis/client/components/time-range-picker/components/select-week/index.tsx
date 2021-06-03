import { WeekPicker } from '@zent/compat';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { format, subWeeks, addDays, startOfWeek } from 'date-fns';
import PickerBtn, { IPickerBtnRef, IPresetItem } from '../picker-btn';
import { getWeekOfYear } from '../../utils';
import { SelectedTimeType } from '../../types';
import { useConvertTime } from '../../hooks';

import './style.scss';

export interface ISelectWeekProps {
  date: SelectedTimeType;
  onChange: (date: SelectedTimeType) => void;
}

const SelectWeek: FC<ISelectWeekProps> = ({ date, onChange }) => {
  const values = useConvertTime(date);

  const [rangeTime, chooseIndex] = values;
  const [startTime] = rangeTime;

  const ref = useRef<IPickerBtnRef>({} as IPickerBtnRef);

  const preset: IPresetItem[] = useMemo(() => {
    return [
      {
        text: '本周',
        onClick: chooseIndex => {
          onChange([[new Date().getTime()], chooseIndex]);
        },
      },
      {
        text: '上周',
        onClick: chooseIndex => {
          onChange([[subWeeks(new Date(), 1).getTime()], chooseIndex]);
        },
      },
    ];
  }, [onChange]);

  const handleChange = useCallback(
    value => {
      onChange([
        [
          startOfWeek(
            addDays(value[0]!, 1),
            {
              weekStartsOn: 1,
            },
          ).getTime(),
        ],
        undefined,
      ]);

      ref.current && ref.current.resetSelectedIndex();
    },
    [onChange],
  );

  return (
    <div className="time-range-picker__week">
      <span style={{ marginRight: 10 }}>
        {format(startTime, 'YYYY')}年第{getWeekOfYear(startTime)}周
      </span>

      <WeekPicker
        valueType="date"
        format="YYYY-MM-DD"
        canClear={false}
        value={[startTime, addDays(startTime, 7)]}
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

export default SelectWeek;
