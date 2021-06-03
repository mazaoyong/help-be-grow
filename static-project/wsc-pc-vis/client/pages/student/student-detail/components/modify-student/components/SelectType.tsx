import { Select } from '@zent/compat';
import React, { FC, useCallback, useMemo } from 'react';
import findIndex from 'lodash/findIndex';
// import isEqual from 'lodash/isEqual';
import { IProfileField } from '../types';

const SelectType: FC<IProfileField & Record<string, any>> = props => {
  const { value, tags, options, onChange } = props;

  const normalizeValue = useMemo(() => {
    if (tags && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  }, [value, tags]);

  const handleChange = useCallback(
    (_, selected: any) => {
      let newValue = selected;
      if (tags) {
        // 检测原有的id的合法性
        newValue = (normalizeValue as string[]).filter(
          v => findIndex(options, opt => String(opt.value) === String(v)) > -1,
        );
        newValue.push(selected.value);
      }
      onChange && onChange(newValue);
    },
    [normalizeValue, onChange, options, tags],
  );

  const handleDelete = useCallback(
    item => {
      if (tags) {
        // 多选
        const newValue = (normalizeValue as (number | string)[]).filter(
          val => String(val) !== String(item.value),
        );
        onChange && onChange(newValue);
      }
    },
    [normalizeValue, onChange, tags],
  );

  return (
    <Select
      tags={tags}
      value={normalizeValue}
      data={props.options || []}
      onDelete={handleDelete}
      onChange={handleChange}
    />
  );
};

export default SelectType;
