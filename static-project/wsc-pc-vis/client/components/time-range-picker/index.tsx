import React, { FC, useCallback, useMemo } from 'react';
import { Select } from '@zent/compat';
import { addMonths, addWeeks, subDays, startOfMonth, startOfWeek } from 'date-fns';

import SelectDay from './components/select-day';
import SelectWeek from './components/select-week';
import SelectMonth from './components/select-month';
import SelectCustom from './components/select-custom';

import { SELECT_OPTIONS } from './constants';
import { setToDayStartTime, setToDayEndTime, safeToNumber } from './utils';
import { SelectTypeEnum, SelectedTimeType, ValueType } from './types';

import './styles.scss';

interface ITimeRangePickerProps {
  value: ValueType;
  onChange: (values: ValueType) => void;
}

const TimeRangePicker: FC<ITimeRangePickerProps> = ({ value, onChange }) => {
  const [selectedTime, selectedType] = value || [];

  /** 当前时间筛选器选择的类型 [日, 周, 月, 自定义] */
  const type = useMemo(() => {
    return safeToNumber(selectedType) ?? SelectTypeEnum.CUSTOM;
  }, [selectedType]);

  /**
   * 自定义时间范围选择
   */
  const calcCustomDateTime = useCallback((startTime: number, endTime: number) => {
    const start = startTime && setToDayStartTime(startTime).getTime();
    const end = endTime && setToDayEndTime(endTime).getTime();

    return [start, end];
  }, []);

  /**
   * 非自定义时间范围选择
   */
  const calcDateTime = useCallback(
    (startTime: number, currentType?: SelectedTimeType | number) => {
      if (!startTime) return [];

      const calcType = currentType ?? type;

      let start = new Date(startTime);
      let end;

      start.setHours(0, 0, 0, 0);

      switch (calcType) {
        case SelectTypeEnum.DAY:
          end = setToDayEndTime(startTime);
          break;
        case SelectTypeEnum.WEEK:
          start = startOfWeek(start, { weekStartsOn: 1 });
          end = subDays(
            addWeeks(setToDayEndTime(start), 1),
            1
          );
          break;
        case SelectTypeEnum.MONTH:
          start = startOfMonth(start);
          end = subDays(
            addMonths(setToDayEndTime(start), 1),
            1
          );
          break;
        default:
          break;
      }

      return [start.getTime(), end.getTime()];
    },
    [type],
  );

  const handleValueChange = useCallback(
    (value: SelectedTimeType, currentType?: SelectTypeEnum) => {
      const calcType = currentType ?? type;

      const [timeArr, chooseDay] = value || [];
      const [startTime, endTime] = timeArr || [];

      const timeRange =
      calcType === SelectTypeEnum.CUSTOM
        ? calcCustomDateTime(startTime, endTime)
        : calcDateTime(startTime, calcType);
      onChange([[timeRange, chooseDay], calcType]);
    },
    [calcCustomDateTime, calcDateTime, onChange, type],
  );

  const handleSelectedTypeChange = useCallback((e) => {
    const currentType = e.target.value;

    if (currentType === SelectTypeEnum.CUSTOM) {
      handleValueChange(
        [[], undefined],
        currentType,
      );
    } else {
      handleValueChange(
        [[new Date().getTime()], undefined],
        currentType,
      );
    }
  }, [handleValueChange]);

  return (
    <div className="time-range-picker__wrapper">
      <Select
        className="time-range-picker"
        value={type}
        onChange={handleSelectedTypeChange}
        data={SELECT_OPTIONS}
        autoWidth
      />

      {type === SelectTypeEnum.DAY ? (
        <SelectDay date={selectedTime} onChange={handleValueChange} />
      ) : type === SelectTypeEnum.WEEK ? (
        <SelectWeek date={selectedTime} onChange={handleValueChange} />
      ) : type === SelectTypeEnum.MONTH ? (
        <SelectMonth date={selectedTime} onChange={handleValueChange} />
      ) : (
        <SelectCustom date={selectedTime} onChange={handleValueChange} />
      )}
    </div>
  );
};

export default TimeRangePicker;
