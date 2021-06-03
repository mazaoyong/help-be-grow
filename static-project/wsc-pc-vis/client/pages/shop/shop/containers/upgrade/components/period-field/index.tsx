
import { Form, IFormControlGroupProps } from '@zent/compat';
/**
 * 软件周期组件
 */
import React, { FC, useCallback } from 'react';
import { periods } from '../../constants';

import './style.scss';

const PeriodField: FC<IFormControlGroupProps> = (props) => {
  const { value, onSelectChange = () => {} } = props;

  const onYearClick = useCallback((period) => {
    if (period !== value) {
      onSelectChange(period);
    }
  }, [onSelectChange, value]);

  return <div className="period-field">
    {periods.map((period, index) => {
      return <div onClick={() => onYearClick(period)} key={index} className={`period-field__card ${value === period ? 'period-field__selectcard' : ''}`}>
        {period}年
      </div>;
    })}
  </div>;
};

export default Form.getControlGroup(PeriodField);
