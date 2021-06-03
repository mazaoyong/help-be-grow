import React, { PureComponent } from 'react';
import { Radio, Select, ISelectProps } from 'zent';
import { Form } from '@zent/compat';
import cloneDeep from 'lodash/cloneDeep';
import { padLeft } from '../../../../utils';
import { IMaxResversation } from 'definitions/self-fetch';

const RadioGroup = Radio.Group;
interface ISelectItem {
  value: number | string;
  text: string;
}
export interface IProps {
  value: IMaxResversation;
  onChange: (value: IMaxResversation) => void;
}

const prefix = 'custom-max-reservation-time';

/**
 * 最长预约字段
 */
class MaxResversation extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  getDaysOptions() {
    const days: ISelectItem[] = [];

    for (let i = 1; i <= 30; i++) {
      days.push({
        value: i,
        text: padLeft(i),
      });
    }

    days.push({ value: 60, text: '60' });
    days.push({ value: 90, text: '90' });

    // 更长的预约时间只针对幸福西饼和起码运动馆开放
    const isWhitelistId = [10695955, 63077].indexOf(window._global.kdtId) > -1;
    if (isWhitelistId) {
      days.push({ value: 180, text: '180' });
      days.push({ value: 365, text: '365（1年）' });
      days.push({ value: 730, text: '730（2年）' });
    }

    return days;
  }

  cloneValue() {
    return cloneDeep(this.props.value);
  }

  /**
   * 修改预约时间类型（当天、其他时间）
   */
  handleTypeChange = evt => {
    const value = this.cloneValue();

    value.type = evt.target.value as IMaxResversation['type'];
    this.props.onChange(value);
  };

  /**
   * 修改预约天数
   */
  handleValChange = (
    evt: FirstFuncArg<ISelectProps['onChange']>,
    type: IMaxResversation['type'],
  ) => {
    const value = this.cloneValue();
    const newVal = evt.target.value;

    value.type = type;
    value[type] = newVal;

    this.props.onChange(value);
  };

  render() {
    const { value } = this.props;
    const { type, day } = value;
    const days = this.getDaysOptions();

    return (
      <div className={prefix}>
        <RadioGroup className={`${prefix}__type`} value={type} onChange={this.handleTypeChange}>
          <Radio value="none">只能当天自提</Radio>
          <Radio value="day">
            可预约
            <Select
              value={day}
              data={days}
              optionValue="value"
              optionText="text"
              onChange={evt => {
                this.handleValChange(evt, 'day');
              }}
              disabled={type !== 'day'}
            />
            天内订单
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(MaxResversation);
