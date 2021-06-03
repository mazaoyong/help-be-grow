import React, { FC, useMemo } from 'react';
import { Radio, RadioGroup, NumberInput, Input, FormError } from 'zent';
import { NewStudentRewardDisplaySettingType } from '../../../../types';

import './style.scss';

export interface NewStudentRewardDisplayValue {
  type: number;
  price: number;
  priceLabel: string;
  title: string;
}

interface NewStudentRewardDisplayFieldProps {
  disabled?: boolean;
  value: NewStudentRewardDisplayValue;
  onChange: (val: NewStudentRewardDisplayValue) => void;
}

export const NewStudentRewardDisplayField: FC<NewStudentRewardDisplayFieldProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const priceError = useMemo(() => {
    if (value.type === NewStudentRewardDisplaySettingType.priceAndTitle) {
      if (!value.price) {
        return '请输入奖励金额';
      }
      if (value.price > 999999) {
        return '最大不能超过999999';
      }
      if (value.price <= 0) {
        return '最小不能小于0';
      }
    }
    return '';
  }, [value.price, value.type]);

  const priceLabelError = useMemo(() => {
    if (value.type === NewStudentRewardDisplaySettingType.priceAndTitle) {
      if (!value.priceLabel) {
        return '请输入奖励名称';
      }
      if (value.priceLabel.length > 10) {
        return '最多可输入10个字';
      }
    }
    return '';
  }, [value.priceLabel, value.type]);

  const titleError = useMemo(() => {
    if (value.type === NewStudentRewardDisplaySettingType.onlyTitle) {
      if (!value.title) {
        return '请输入奖励名称';
      }
      if (value.title.length > 20) {
        return '最多可输入20个字';
      }
    }
    return '';
  }, [value.title, value.type]);
  return (
    <RadioGroup
      className="new-student-reward-display-field"
      value={value.type}
      onChange={({ target: { value: type = NewStudentRewardDisplaySettingType.priceAndTitle } }) =>
        onChange({
          ...value,
          type,
        })
      }
    >
      <div className={`radio-item ${priceError || priceLabelError ? 'has-error' : ''}`}>
        <Radio disabled={disabled} value={NewStudentRewardDisplaySettingType.priceAndTitle}>
          金额 + 奖励名称
        </Radio>
        <div className="price-and-title">
          价值&nbsp;&nbsp;
          <div className='input-container'>
            <NumberInput
              disabled={disabled || value.type !== NewStudentRewardDisplaySettingType.priceAndTitle}
              value={value.price}
              width="100px"
              decimal={0}
              showStepper
              integer={false}
              onChange={price =>
                onChange({
                  ...value,
                  price: +price,
                })
              }
            />
            {priceError && <FormError className="form-description error-msg">{priceError}</FormError>}
          </div>
          &nbsp;&nbsp; 元 &nbsp;&nbsp;
          <div className='input-container'>
            <Input
              disabled={disabled || value.type !== NewStudentRewardDisplaySettingType.priceAndTitle}
              value={value.priceLabel}
              width="180px"
              onChange={({ target: { value: priceLabel } }) =>
                onChange({
                  ...value,
                  priceLabel,
                })
              }
            />
            {priceLabelError && <FormError className="form-description error-msg">{priceLabelError}</FormError>}
          </div>
        </div>
      </div>
      <div className={`radio-item ${titleError ? 'has-error' : ''}`}>
        <Radio disabled={disabled} value={NewStudentRewardDisplaySettingType.onlyTitle}>
          <div className="only-title">
            仅名称 &nbsp;&nbsp;
            <div className='input-container'>
              <Input
                disabled={disabled || value.type !== NewStudentRewardDisplaySettingType.onlyTitle}
                value={value.title}
                width="310px"
                placeholder="机构名师好课"
                onChange={({ target: { value: title } }) =>
                  onChange({
                    ...value,
                    title,
                  })
                }
              />
              {titleError && <FormError className="form-description error-msg">{titleError}</FormError>}
            </div>
          </div>
        </Radio>
      </div>
      <div className='radio-item'>
        <Radio disabled={disabled} value={NewStudentRewardDisplaySettingType.rewardDesc}>
          全部奖励内容
        </Radio>
      </div>
    </RadioGroup>
  );
};
