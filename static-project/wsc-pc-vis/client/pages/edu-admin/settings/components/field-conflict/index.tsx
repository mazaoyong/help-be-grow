import React, { FC, useCallback } from 'react';
import { Select } from 'zent';
import getControlGroup from 'components/form/get-control-group';

import style from './style.m.scss';

export interface IFieldConflictParams {
  value: number;
  onChange: (value: number) => void;
}

const FieldConflict: FC<IFieldConflictParams> = (params) => {
  const { value: isAllowConflict, onChange } = params;
  const options = [
    { key: 'true', text: '允许' },
    { key: 'false', text: '不允许' }
  ];
  const chosenValue = isAllowConflict ? options[0] : options[1];
  const handleChange = useCallback((value) => {
    onChange(Number(value.key === 'true'));
  }, [onChange]);

  return (
    <div className={style.conflictField}>
      学员预约日程，时间冲突时
      <Select
        className={style.conflictFieldSelect}
        inline={true}
        options={options}
        onChange={handleChange}
        value={chosenValue}
        clearable={false}
        width={90}
      />
      继续预约
    </div>
  );
};

export default getControlGroup(FieldConflict);
