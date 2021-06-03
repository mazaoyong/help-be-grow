import { Pop, DatePicker, Select } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import { Input, NumberInput } from 'zent';
import { Select as EbizSelect } from '@youzan/ebiz-components';

import { IOptionProps } from './types';
import './styles.scss';

const OptionPop: FC<IOptionProps | any> = props => {
  const {
    trigger = 'click',
    opmode,
    showBottomActions = true,
    className = '',
    value,
    placeholder,
    children,
    handleChange,
    onClose,
  } = props;

  const handleCancel = useCallback(() => {
    const { onCancel } = props;
    if (onCancel) {
      onCancel();
    }
  }, [props]);

  const handleConfirm = useCallback(() => {
    const { onConfirm } = props;
    if (onConfirm) {
      onConfirm();
    }
  }, [props]);

  const renderContent = useCallback(() => {
    switch (opmode) {
      case 'select':
        const { selectOptions } = props;
        if (!selectOptions) {
          return;
        }
        return (
          <Select
            width="185px"
            retainNullOption
            className={className}
            data={selectOptions}
            optionValue="value"
            optionText="text"
            placeholder={placeholder || '请选择'}
            value={value}
            onChange={handleChange}
          />
        );
      case 'date':
        return (
          <DatePicker
            className={className}
            value={value as string | number | Date}
            onChange={handleChange}
          />
        );
      case 'input':
        return (
          <Input
            className={className}
            value={value as string}
            onChange={handleChange}
            placeholder={placeholder}
          />
        );
      case 'numberinput':
        const { decimal = 2, min, max } = props;
        return (
          <NumberInput
            className={className}
            value={value as string | number}
            onChange={handleChange}
            decimal={decimal}
            min={min}
            max={max}
            placeholder={placeholder}
          />
        );
      case 'ebizSelect':
        return (
          <EbizSelect {...props.selectProps} value={[value] as (string|number)[]} onChange={handleChange} />
        );
      case 'custom':
        const { component: Comp } = props;
        if (!Comp) {
          return;
        }
        return (
          <Comp {...props} value={value} onChange={handleChange} />
        );
      default:
    }
  }, [opmode, props, value, className, handleChange, placeholder]);

  return (
    <Pop
      className="batch-ops-pop"
      trigger={trigger}
      content={renderContent()}
      onConfirm={showBottomActions ? handleConfirm : () => {}}
      onCancel={showBottomActions ? handleCancel : () => {}}
      onClose={onClose}
    >
      {children}
    </Pop>
  );
};

export default OptionPop;
