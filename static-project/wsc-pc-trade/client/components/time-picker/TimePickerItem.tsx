import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Notify } from 'zent';
import cloneDeep from 'lodash/cloneDeep';
import TimeSelect from './TimeSelect';
import DaySelect from './DaySelect';
import { ITimePickerItem } from './type';

interface IProps {
  prefix?: string;
  className?: string;
  value: ITimePickerItem;
  values: ITimePickerItem[];
  onChange: (item: ITimePickerItem) => void;
  disabledDays: number[];
}

interface IState {
  value: any;
  originValue: any;
}

export default class TimePickerItem extends Component<IProps, IState> {
  static defaultProps = {
    prefix: 'custom-time-picker-item',
  };

  static propTypes = {
    value: PropTypes.object.isRequired,
    values: PropTypes.array,
    onChange: PropTypes.func,
    prefix: PropTypes.string,
    className: PropTypes.string,
    disabledDays: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: cloneDeep(this.props.value),
      originValue: cloneDeep(this.props.value),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: cloneDeep(nextProps.value),
      originValue: cloneDeep(nextProps.value),
    });
  }

  getData() {
    return this.state.value;
  }

  setData(newValue) {
    this.setState({
      value: newValue,
    });
  }

  updateData(newValue) {
    this.props.onChange(newValue);
  }

  handleTimeChange = (time, type) => {
    const value = this.getData();

    value.timeRange[type] = time;

    this.setData(value);
  };

  handleDaysChange = days => {
    const value = this.getData();

    value.workDays = days;

    this.setData(value);
  };

  handleConfirm = () => {
    const value = this.getData();
    const { active, timeRange, workDays } = value;

    if (active && timeRange[0] >= timeRange[1]) {
      Notify.error('关门时间必须大于开门时间');
      return;
    }

    if (active && workDays.length === 0) {
      Notify.error('请至少选择一天为接待日期');
      return;
    }

    value.active = false;

    this.updateData(value);
  };

  handleCancel = () => {
    const { originValue } = this.state;
    const { _init_ } = originValue;

    if (_init_) {
      this.updateData(null);
    } else {
      originValue.active = false;
      this.updateData(originValue);
    }
  };

  handleEdit = () => {
    let activeSum = 0;
    const { originValue } = this.state;
    const values = this.props.values;

    values.forEach(item => {
      if (item.active) {
        ++activeSum;
      }
    });

    if (activeSum >= 1) {
      Notify.error('请先确认接待时间再编辑');
      return;
    }

    originValue.active = true;

    this.updateData(originValue);
  };

  handleDelete = () => {
    this.updateData(null);
  };

  render() {
    const { prefix, className, disabledDays } = this.props;
    const { active = false, timeRange = ['00:00', '00:00'], workDays = [] } = this.getData();

    const NS = cx(prefix, className);

    return (
      <div className={NS}>
        <div className={`${NS}__left`}>
          <TimeSelect
            active={active}
            time={timeRange[0]}
            onChange={time => {
              this.handleTimeChange(time, 0);
            }}
          />
          <i>~</i>
          <TimeSelect
            active={active}
            time={timeRange[1]}
            onChange={time => {
              this.handleTimeChange(time, 1);
            }}
          />
        </div>
        <div className={`${NS}__right`}>
          <DaySelect
            active={active}
            selectedDays={workDays}
            disabledDays={disabledDays}
            onChange={this.handleDaysChange}
          />
        </div>
        <div className={`${NS}__action`}>
          {active ? (
            <div>
              <span onClick={this.handleConfirm}>确认</span>
              <span>｜</span>
              <span onClick={this.handleCancel}>取消</span>
            </div>
          ) : (
            <div>
              <span onClick={this.handleEdit}>编辑</span>
              <span>｜</span>
              <span onClick={this.handleDelete}>删除</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
