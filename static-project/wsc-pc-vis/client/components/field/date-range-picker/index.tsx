import { DatePicker } from '@zent/compat';
import React, { FC, useCallback, useMemo } from 'react';
import date from '@youzan/utils/date';

import './styles.scss';

type DateTime = string | number | Date;

interface IDateTimeRangePickerProps {
  value: string[];
  onChange: (val: DateTime[]) => void;
  disabled?: boolean;
  disableStartTime?: boolean;
  disableEndTime?: boolean;
  defaultTime: string[];
  formatTime?: string;
}

const now = new Date().getTime();

const { parseDate, formatDate } = date;

const DateTimeRangePicker: FC<IDateTimeRangePickerProps> = (props) => {
  const {
    value,
    onChange,
    disabled,
    disableStartTime,
    disableEndTime,
    formatTime = 'YYYY-MM-DD HH:mm:ss',
  } = props;

  const [startTime = '', endTime = '']: DateTime[] = useMemo(() => value || ['', ''], [value]);

  const onChangeDate = useCallback(
    (id: 0 | 1) => (value: DateTime) => {
      if (id === 0) {
        onChange([value, endTime]);
      } else if (id === 1) {
        onChange([startTime, value]);
      }
    },
    [startTime, endTime, onChange],
  );

  return (
    <div className="datetime-range-picker">
      <DatePicker
        className="zent-picker"
        showTime
        min={now}
        max={value[1]}
        value={startTime}
        valueType="number"
        format={formatTime}
        onChange={onChangeDate(0)}
        defaultTime={formatDate(now, 'HH:mm:ss')}
        disabled={disabled || disableStartTime}
      />
      <span className="text">至</span>
      <DatePicker
        className="zent-picker"
        showTime
        min={startTime && parseDate(startTime, formatTime).getTime() + 1}
        value={endTime}
        valueType="number"
        format={formatTime}
        onChange={onChangeDate(1)}
        defaultTime="23:59:59"
        disabled={disabled || disableEndTime}
      />
    </div>
  );
};

export default DateTimeRangePicker;
