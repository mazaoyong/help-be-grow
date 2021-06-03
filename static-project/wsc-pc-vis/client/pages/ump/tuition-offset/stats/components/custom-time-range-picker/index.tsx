import { DateRangePicker, DatePickers } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import date from '@youzan/utils/date';

const { formatDate, travel, parseDate } = date;

const now = new Date();

const oneDay = 24 * 60 * 60 * 1000;

const CustomDateRangePicker: FC<{ value, onChange }> = (props) => {
  const { value: timeRange, onChange: setTimeRange } = props;

  const disabledDate = useCallback((val: DatePickers.Value) => {
    const endDate = timeRange[1];
    if (!endDate) {
      return now.getTime() < parseDate(val as string, 'YYYY-MM-DD').getTime();
    }
    return (
      now.getTime() < parseDate(val as string, 'YYYY-MM-DD').getTime() ||
      parseDate(endDate as string, 'YYYY-MM-DD').getTime() - 89 * oneDay > parseDate(val as string, 'YYYY-MM-DD').getTime()
    );
  }, [timeRange]);

  return (
    <DateRangePicker
      className="date-range-picker"
      value={timeRange}
      disabledDate={disabledDate}
      onChange={(val: DatePickers.RangeValue) => {
        const [startDate = '', endDate = ''] = val;
        if (!startDate || !endDate) {
          setTimeRange(val);
          return;
        }
        if (parseDate(endDate as string, 'YYYY-MM-DD').getTime() -
          parseDate(startDate as string, 'YYYY-MM-DD').getTime() > 89 * oneDay) {
          setTimeRange([formatDate(travel(-89, parseDate(endDate as string, 'YYYY-MM-DD')), 'YYYY-MM-DD'), endDate]);
          return;
        }
        setTimeRange(val);
      }}
    />
  );
};

export default CustomDateRangePicker;
