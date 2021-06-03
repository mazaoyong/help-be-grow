import { DatePicker } from '@zent/compat';
import React, { FC, useCallback } from 'react';

interface IProps {
  value: string[];
  onChange: (val: string[]) => void;
  disabled: boolean[];
}

const TimeField: FC<IProps> = ({ value, onChange, disabled }) => {
  const handleChangeStartTime = useCallback((val) => {
    let newVal = [val, value[1]];
    onChange(newVal);
  }, [onChange, value]);
  const handleChangeEndTime = useCallback((val) => {
    let newVal = [value[0], val];
    onChange(newVal);
  }, [onChange, value]);
  return (
    <>
      <DatePicker
        value={value[0]}
        min={Date.now()}
        showTime={true}
        defaultTime='00:00:00'
        disabled={disabled[0]}
        format='YYYY-MM-DD HH:mm:ss'
        onChange={handleChangeStartTime}
      />
      <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
      <DatePicker
        value={value[1]}
        min={Date.now()}
        showTime={true}
        disabled={disabled[1]}
        defaultTime='23:59:59'
        format='YYYY-MM-DD HH:mm:ss'
        onChange={handleChangeEndTime}
      />
    </>
  );
};

export default TimeField;
