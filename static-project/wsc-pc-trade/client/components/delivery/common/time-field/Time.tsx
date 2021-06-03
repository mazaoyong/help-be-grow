import React, { Component } from 'react';
import { Form } from '@zent/compat';
import { BusinessHour } from '@youzan/react-components';
import { IBusinessHour } from 'definitions/delivery-time';

export interface IProps {
  value: IBusinessHour;
  onChange: (v: IBusinessHour) => void;
  forbidTomorrowInTimePicker?: boolean;
}

type ITimeComponentState = IBusinessHour & {
  validateAll: boolean;
};

/**
 * 新版时间字段组件
 */
class TimeComponent extends Component<ZENT_FIELD_COMP<IProps>, ITimeComponentState> {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      mode: value.mode || 1,
      dailyValue: value.dailyValue || [],
      weeklyValue: value.weeklyValue || [],
      validateAll: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ validateAll: true });
    }, 300);
  }

  onChange = times => {
    const { value } = this.props;
    const { mode } = this.state;
    if (mode === BusinessHour.Mode.DAILY_REPEAT) {
      this.setState({
        dailyValue: times,
      });
      this.props.onChange({
        ...value,
        dailyValue: times,
      });
    } else if (mode === BusinessHour.Mode.WEEKLY_REPEAT) {
      this.setState({
        weeklyValue: times,
      });
      this.props.onChange({
        ...value,
        weeklyValue: times,
      });
    }
  };

  onModeChange = mode => {
    const { value } = this.props;
    this.setState({
      mode,
    });
    this.props.onChange({
      ...value,
      mode,
    });
  };
  getValueForMode = mode => {
    if (mode === BusinessHour.Mode.FULLTIME) {
      return [];
    }
    if (mode === BusinessHour.Mode.DAILY_REPEAT) {
      return this.state.dailyValue;
    }
    if (mode === BusinessHour.Mode.WEEKLY_REPEAT) {
      return this.state.weeklyValue;
    }
  };
  render() {
    const { validateAll } = this.state;
    const { value, forbidTomorrowInTimePicker } = this.props;
    return (
      <div className="time-field">
        <BusinessHour.ConfigProvider value={{ forbidTomorrowInTimePicker }}>
          <BusinessHour
            disabled={false}
            mode={value.mode}
            value={this.getValueForMode(value.mode)}
            onModeChange={this.onModeChange}
            onChange={this.onChange}
            validateAll={validateAll}
          />
        </BusinessHour.ConfigProvider>
        <p className="help-desc">
          若设置一天多个时段如：每天 12:00～14:00 16:00～20:00&nbsp;
          小程序2.39.1版本以上才生效&nbsp;具体请&nbsp;
          <a
            href="https://bbs.youzan.com/forum.php?mod=viewthread&tid=677338"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'pointer' }}
          >
            查看教程
          </a>
        </p>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(TimeComponent);
