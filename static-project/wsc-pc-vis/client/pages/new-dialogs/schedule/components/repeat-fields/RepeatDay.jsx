
import { Form } from '@zent/compat';
import { Radio } from 'zent';
import format from 'date-fns/format';
import React, { useState, useEffect } from 'react';
import getMaxTimes from '../../utils/caculate-max-times';
const { FormSection, FormRadioGroupField, FormNumberInputField, FormDatePickerField } = Form;

const RepeatDayField = props => {
  const { disabled, operateType = 1 } = props || {};
  // 控制按课节总数还是按照结束日期
  const [endType, setEndType] = useState(props.endType || 1);
  const [maxClassTimes, setMaxClassTimes] = useState(999);

  // 设置开始时间不能晚于当天
  const getDisabledDate = time => {
    const { disabledDate = [] } = props;
    const now = format(new Date(), 'YYYY-MM-DD 00:00:00');
    const current = new Date(time).getTime();
    // 如果选择了有开班结班时间的班级，需要禁用开始时间之前以及结束时间之后的时间
    if (disabledDate[0] && disabledDate[2]) {
      const startTime = new Date(disabledDate[0]).getTime();
      // 如果今天要比开课时间来的早，那么设置最早开课时间为今天
      const leastTime = disabledDate[1] || now;
      const start = new Date(leastTime) > startTime ? leastTime : startTime;
      const end = disabledDate[2];
      return current < new Date(start).getTime() || current > new Date(end).getTime();
    }
    // 如果没有开始时间结束时间，仅仅禁用今天之前, 以及今天的一年以后
    return isEndDateInYear(disabledDate[1] || now, current);
  };

  // 判断日程结束时间是否在一年内
  const isEndDateInYear = (startTime, currentTime) => {
    const minTime = new Date(startTime);
    const maxTime = new Date(startTime);
    maxTime.setFullYear(minTime.getFullYear() + 1);
    return currentTime < minTime.getTime() || currentTime > maxTime.getTime();
  };

  const cantBeforeStart = (_, value) => {
    return new Promise((resolve, reject) => {
      let result = true;
      let message = 'validate';
      if (value) {
        const { disabledDate = [] } = props;
        const current = new Date(value).getTime();
        if (disabledDate[0] && disabledDate[2]) {
          if (current < new Date(disabledDate[0]).getTime() || current > new Date(disabledDate[2]).getTime()) {
            result = false;
            message = '结束时间必须在班级开课时间内';
          }
        } else {
          const now = format(new Date(), 'YYYY-MM-DD 00:00:00');
          if (isEndDateInYear(disabledDate[1] || now, current)) {
            result = false;
            message = '结束时间必须在开始时间一年内';
          }
        }
      }
      if (result) resolve(message);
      else reject(message);
    });
  };

  // 如果是disabledDate发生变化，就计算最大的课节总数
  useEffect(_ => {
    const { type, disabledDate, operateType } = props;
    if (operateType === 1) {
      if (endType === 1 && type === 1) {
        // 如果按照课节总数结束，需要计算
        setMaxClassTimes(getMaxTimes(1, disabledDate[1], disabledDate[2]));
      } else {
        setMaxClassTimes(999);
      }
    }
  }, [endType, props, props.disabledDate]);

  // 设置结束方式
  useEffect(
    _ => {
      if (props.endType) {
        setEndType(props.endType);
      }
    },
    [props.endType],
  );

  return (
    <FormSection name="repeatDay">
      <FormRadioGroupField
        name="endType"
        value={endType}
        label="结束方式："
        disabled={disabled}
        onChange={e => setEndType(e.target.value)}
      >
        <Radio value={1}>按课节总数</Radio>
        <Radio value={2}>按日期结束</Radio>
      </FormRadioGroupField>
      {endType === 1 ? (
        <FormNumberInputField
          required
          label="排课总数："
          name="totalTimes"
          disabled={disabled}
          placeholder="本次要排的课节总数"
          validations={{
            required: true,
            maxTimes: (_, val) => {
              if (maxClassTimes <= 0) return true;
              return operateType === 1
                ? val <= maxClassTimes
                : true;
            },
          }}
          validationErrors={{ required: '请填写排课总数', maxTimes: `排课总数不能超过${maxClassTimes}节` }}
        />
      ) : (
        <FormDatePickerField
          required
          name="endDate"
          label="结束日期："
          disabled={disabled}
          dateFormat="YYYY-MM-DD"
          disabledDate={getDisabledDate}
          validations={{ required: true }}
          asyncValidation={cantBeforeStart}
          validationErrors={{ required: '结束日期不能为空' }}
        />
      )}
    </FormSection>
  );
};

export default RepeatDayField;
