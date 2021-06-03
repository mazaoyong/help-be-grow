
import { Form } from '@zent/compat';
import React, { useEffect, useState } from 'react';
import { format, setMinutes, setHours } from 'date-fns';
import SelectTimeReversed from '../../../appointment/components/select-time-reserve/SelectTimeReserve';

const { getControlGroup, Field } = Form;

const FifthGapPicker = props => {
  const { value, onChange, ...otherProps } = props;
  const [selectedTime, setSelectedTime] = useState(value || '');

  const handleChangeVal = val => {
    setSelectedTime(val);
    if (onChange) {
      onChange(val);
    }
  };
  return (
    <SelectTimeReversed {...otherProps} canChoose value={selectedTime} onChange={handleChangeVal} />
  );
};

const FifthGapRangePicker = props => {
  const { placeholder = [], value = [], ...otherProps } = props;
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [disableEnd, setDisableEnd] = useState('');
  // 如果选择的开始日期是今天，就禁用当前时间之间的时间
  const [disableTime, setDisableTime] = useState('');

  useEffect(
    _ => {
      setDisableEnd(startTime);
      // 提示form更新
      props.onChange([startTime, endTime]);
    },
    [startTime, endTime],
  );

  useEffect(
    _ => {
      const now = new Date();
      const selectedDate = props.date;
      // 如果选择了日期，不设置禁用
      if (selectedDate) {
        const strNow = format(now, 'YYYY-MM-DD 00:00:00');
        const formatedSelectTime = format(selectedDate, 'YYYY-MM-DD 00:00:00');
        if (new Date(strNow).getTime() < new Date(formatedSelectTime).getTime()) {
          setDisableTime('');
          return void 0;
        }
      }
      const mins = now.getMinutes();
      const hours = now.getHours();
      const newMins = Math.floor(mins / 15) * 15;
      let clostestTime = setMinutes(now, newMins >= 60 ? 0 : newMins);
      if (newMins >= 60) {
        clostestTime = setHours(clostestTime, hours + 1);
      }
      setDisableTime(format(clostestTime, 'HH:mm'));
    },
    [props.date],
  );

  const handleChangeVal = (method, val, confirm) => confirm && method(val);

  return (
    <>
      <SelectTimeReversed
        {...otherProps}
        canChoose
        value={startTime || value[0]}
        placeholder={placeholder[0]}
        endDisableValue={disableTime}
        onChange={handleChangeVal.bind(null, setStartTime)}
      />
      <label style={{ margin: '0 10px' }}>至</label>
      <SelectTimeReversed
        {...otherProps}
        canChoose
        value={endTime || value[1]}
        placeholder={placeholder[1]}
        endDisableValue={disableEnd || disableTime}
        onChange={handleChangeVal.bind(null, setEndTime)}
      />
    </>
  );
};

const FifthGapPickerControl = getControlGroup(FifthGapPicker);
const FifthGapRangePickerControl = getControlGroup(FifthGapRangePicker);

const FifthGapPickerField = props => <Field {...props} component={FifthGapPickerControl} />;
const FifthGapRangePickerField = props => (
  <Field {...props} component={FifthGapRangePickerControl} />
);

export default FifthGapPicker;
export { FifthGapPickerField, FifthGapRangePickerField };
