import React, { FC, useCallback } from 'react';
import { DateRangePicker } from '@zent/compat';
import { IChartFilterProps } from '../../types';

const DaterangeFC: FC<IChartFilterProps> = (props) => {
  const { onDateChange, value } = props;
  const onChangeRange: (vals: any[]) => void = useCallback((vals) => {
    onDateChange(vals);
  }, [ onDateChange ]);

  return (
    <DateRangePicker
      className="study-trend"
      format="YYYY-MM-DD HH:mm:ss"
      valueType="date"
      showTime={false}
      // disabledDate={this.disabledRangeDate}
      // disabledTime={this.disabledRangeTime}
      value={[ value[0].getTime(), value[1].getTime() ]}
      onChange={onChangeRange}
    />
  );
};

export default DaterangeFC;
