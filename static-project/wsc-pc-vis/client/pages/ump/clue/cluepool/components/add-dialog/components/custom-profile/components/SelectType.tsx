
import { Select, Form, IFormControlGroupProps } from '@zent/compat';
import React, { FC } from 'react';
import findIndex from 'lodash/findIndex';

import { IProfileField } from '../index';

const { getControlGroup } = Form;

const SelectType: FC<IFormControlGroupProps & IProfileField> = props => {
  const handleChange = (_, selected: any) => {
    const { onChange, value, tags, options } = props;
    let newValue = selected;
    if (tags) {
      // 检测原有的id的合法性
      newValue = (value as string[]).filter(
        v => findIndex(options, opt => String(opt.value) === String(v)) > -1
      );
      newValue.push(selected.value);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleDelete = item => {
    const { tags, value, onChange } = props;
    if (tags) {
      // 多选
      const newValue = (value as (number | string)[]).filter(val => Number(val) !== Number(item.value));
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <Select
      {...props}
      data={props.options}
      onDelete={handleDelete}
      onChange={handleChange}
    />
  );
};

export default getControlGroup(SelectType as any);
