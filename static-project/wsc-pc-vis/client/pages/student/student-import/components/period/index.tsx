import React, { useCallback } from 'react';
import { NumberInput } from 'zent';

import { IFormMultiFieldType } from '../../types';

import './styles.scss';

const Period = props => {
  const { value = [null, null], onChange } = props;

  const onValueChange = useCallback((type: IFormMultiFieldType) => (val: number | string) => {
    const ret = value ? value.slice() : [];

    if (type === 'start') {
      ret.length === 2 ? ret.splice(0, 1, val) : ret.splice(0, 1, val, '');
    } else {
      ret.length === 0 ? ret.splice(1, 1, '', val) : ret.splice(1, 1, val);
    }
    onChange(ret);
  }, [value, onChange]);

  return (
    <div className="period-field">
      <span className="period-field-text">
        剩余
        <NumberInput
          onChange={onValueChange('start')}
          value={value[0]}
          decimal={2}
        />
        课时，共购买
        <NumberInput
          onChange={onValueChange('end')}
          value={value[1]}
          decimal={2}
          min={0}
        />
        课时
      </span>
    </div>
  );
};

export default Period;
