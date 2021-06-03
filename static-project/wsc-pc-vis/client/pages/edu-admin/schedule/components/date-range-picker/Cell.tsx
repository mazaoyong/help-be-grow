import React, { Component } from 'react';
import compareTime from 'fns/date/compare-time';
import { TimePicker } from '@youzan/ebiz-components';
import { IDateRangePickerCellProps, IDateRangePickerCellState } from './type';
import { Notify } from 'zent';
import cx from 'classnames';
import { ITimePickerValue } from '@youzan/ebiz-components/es/types/time-picker';

export default class DateRangePickerCell extends Component<
IDateRangePickerCellProps,
IDateRangePickerCellState
> {
  static defaultProps: Partial<IDateRangePickerCellProps> = {
    data: {
      startTime: '09:00',
      endTime: '09:00',
      configType: 1,
    },
  };

  readonly state = {
    startTime: this.props.data.startTime,
    endTime: this.props.data.endTime,
  };

  onCancel = () => {
    const { setEdit, data } = this.props;
    setEdit();
    this.setState({
      startTime: data.startTime,
      endTime: data.endTime,
    });
  };

  onSave = () => {
    const { startTime, endTime } = this.state;
    this.props.onSave(Object.assign({}, this.props.data, { startTime, endTime }));
  };

  getTime = (startTime, endTime) => {
    const { getTime } = this.props;
    if (getTime) {
      getTime(Object.assign({}, this.props.data, { startTime, endTime }));
    }
  }

  onStartTimeChange = val => {
    if (compareTime(val, this.state.endTime)) {
      this.setState({ startTime: val, endTime: val });
      this.getTime(val, val);
    } else {
      this.setState({ startTime: val });
      this.getTime(val, this.state.endTime);
    }
  }

  render() {
    const { isEdit, setEdit, data, onDelete, hasSave = true, className = '', getTime = undefined } = this.props;
    const { startTime, endTime } = this.state;

    if (isEdit) {
      if (getTime) {
        this.getTime(startTime, endTime); // 获取时间选择器初始值
      }
      return (
        <li className={cx('date-range-picker__cell', className)} >
          <div className="date-range-picker__cell__left">
            <TimePicker
              name="startTime"
              value={startTime}
              type="HH:mm"
              onChange={this.onStartTimeChange}
              disabledTime={{
                disabledMinutes: (val: number) => {
                  return val % 5 !== 0;
                },
              }}
              hideTime={{
                disabledMinutes: (val: number) => {
                  return val % 5 !== 0;
                },
              }}
              placeholder="请选择开始时间"
            />
            <span>&nbsp;至&nbsp;</span>
            <TimePicker
              name="endTime"
              value={endTime}
              type="HH:mm"
              onChange={val => {
                if (this.state.startTime.slice(0, 2) === val.slice(0, 2) &&
                 parseInt(this.state.startTime.slice(-2)) >= parseInt(val.slice(-2))) {
                  Notify.error('结束时间需大于开始时间');
                } else {
                  this.setState({ endTime: val });
                  this.getTime(this.state.startTime, val);
                }
              }}
              hideTime={{
                disabledAll: (val: ITimePickerValue) => {
                  const { hour = 0, minute = 0 } = val;
                  return minute % 5 !== 0 || hour < parseInt(this.state.startTime.slice(0, 2));
                },
              }}
              placeholder="请选择结束时间"
            />
          </div>
          {hasSave
            ? <div className="date-range-picker__cell__right">
              <span className="ui-link--split" onClick={this.onSave}>
                保存
              </span>
              <span className="ui-link--split" onClick={this.onCancel}>
                取消
              </span>
            </div>
            : null
          }
        </li>
      );
    }
    return (
      <li className="date-range-picker__cell">
        <div>
          {startTime} 至 {endTime}
        </div>
        <div>
          <span className="ui-link--split" onClick={() => setEdit(data)}>
            编辑
          </span>
          <span className="ui-link--split" onClick={() => onDelete!(data)}>
            删除
          </span>
        </div>
      </li>
    );
  }
}
