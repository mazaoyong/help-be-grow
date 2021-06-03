import React, { PureComponent } from 'react';
import { Radio, Select, Input, ISelectProps } from 'zent';
import { Form } from '@zent/compat';
import cloneDeep from 'lodash/cloneDeep';
import { padLeft } from '../../../utils';
import { IAppointmentOrderValue } from 'definitions/local-delivery';

const RadioGroup = Radio.Group;

const prefix = 'custom-apointment-time';

export interface IProps {
  value: IAppointmentOrderValue;
  onChange: (v: IAppointmentOrderValue) => void;
}

interface IState {
  minute: number | string;
}

class AppointmentOrder extends PureComponent<ZENT_FIELD_COMP<IProps>, IState> {
  constructor(props: ZENT_FIELD_COMP<IProps>) {
    super(props);
    this.state = {
      minute: this.props.value.minute,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      minute: nextProps.value.minute,
    });
  }

  getNumberOptions(max: number) {
    return new Array(max).fill(0).map((_, i) => ({
      value: i + 1,
      text: padLeft(i + 1),
    }));
  }

  cloneValue() {
    return cloneDeep(this.props.value);
  }

  handleTypeChange = evt => {
    const value = this.cloneValue();

    // @ts-ignore
    value.type = evt.target.value as IAppointmentOrderValue['type'];
    this.props.onChange(value);
  };

  handleMinuteChange = evt => {
    const value = evt.target.value;

    if (/\d+$/g.test(value) || /^\s?$/g.test(value)) {
      this.setState({
        minute: value,
      });
    }
  };

  handleValChange = (
    evt: FirstFuncArg<ISelectProps['onChange']>,
    // @ts-ignore
    type: IAppointmentOrderValue['type'],
  ) => {
    const value = this.cloneValue();
    const newVal = evt.target.value;

    value.type = type;
    value[type] = newVal;

    this.props.onChange(value);
  };

  render() {
    const { value } = this.props;
    const { type, day, hour } = value;
    const { minute } = this.state;
    const days = this.getNumberOptions(31);
    const hours = this.getNumberOptions(48);

    return (
      <div className={prefix}>
        <RadioGroup className={`${prefix}__type`} value={type} onChange={this.handleTypeChange}>
          <Radio value="none">无需提前</Radio>
          <Radio value="day">
            提前
            <Select
              className="no-error"
              data={days}
              optionValue="value"
              optionText="text"
              value={day}
              onChange={evt => {
                this.handleValChange(evt, 'day');
              }}
              disabled={type !== 'day'}
            />
            天
          </Radio>
          <p className="help">
            为自然天，如：提前1天，则不管是凌晨1点还是晚上23点，都只能下明天以后的订单
          </p>
          <Radio value="hour">
            提前
            <Select
              className="no-error"
              data={hours}
              optionValue="value"
              optionText="text"
              value={hour}
              onChange={evt => {
                this.handleValChange(evt, 'hour');
              }}
              disabled={type !== 'hour'}
            />
            小时
          </Radio>
          <Radio value="minute">
            提前
            <Input
              value={String(minute)}
              onChange={this.handleMinuteChange}
              onBlur={evt => {
                this.handleValChange(evt, 'minute');
              }}
              inline
              disabled={type !== 'minute'}
            />
            分钟
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(AppointmentOrder);
