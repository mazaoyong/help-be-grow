
import { DatePicker, Form } from '@zent/compat';
import React from 'react';
import { isAfter } from 'date-fns';

import './styles.scss';

const { getControlGroup } = Form;

function DateRangeField(props) {
  const value = props.value || [];
  const config = props.config || {};
  const onChange = props.onChange;
  const handleChange = cursor => v => {
    onChange([ cursor === 'start' ? v : value[0], cursor === 'end' ? v : value[1] ]);
  };
  return (
    <div>
      <DatePicker
        {...config[0]}
        value={value[0]}
        onChange={handleChange('start')}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
      />
      <span className="pct-freebie-date-range-field-split">
        至
      </span>
      <DatePicker
        {...config[1]}
        value={value[1]}
        onChange={handleChange('end')}
        showTime
        min={isAfter(value[0], config[1].min) ? value[0] : config[1].min}
        format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
  );
}

export default getControlGroup(DateRangeField);
