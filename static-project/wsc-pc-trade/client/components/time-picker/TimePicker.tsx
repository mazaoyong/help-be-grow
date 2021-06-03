import React, { PureComponent } from 'react';
import cx from 'classnames';
import uniq from 'lodash/uniq';
import noop from 'lodash/noop';
import difference from 'lodash/difference';
import TimePickerItem from './TimePickerItem';
import { ITimePickerItem } from './type';

import './index.scss';

interface IProps {
  prefix?: string;
  className?: string;
  value: ITimePickerItem[];
  onChange: (value: ITimePickerItem[]) => void;
  defaultAddTime?: Omit<ITimePickerItem, 'active' | '_init_'>;
}

export default class TimePicker extends PureComponent<IProps> {
  static defaultProps = {
    prefix: 'custom-time-picker',
    value: [],
    onChange: noop,
  };

  getData() {
    return (this.props.value && this.props.value.slice()) || [];
  }

  // 筛选出已被选择的天
  getDisabledDays() {
    let disabledDays: number[] = [];
    const value = this.getData();

    value.forEach(item => {
      if (!item.active) {
        disabledDays = disabledDays.concat(item.workDays);
      }
    });
    return uniq(disabledDays);
  }

  /**
   * 修改或删除条目
   */
  handeChange = (data: ITimePickerItem, index: number) => {
    const value = this.getData();

    if (data) {
      if (data._init_) {
        delete data._init_;
      }
      value[index] = data;
    } else {
      value.splice(index, 1);
    }

    this.props.onChange(value);
  };

  // 增加条目
  handleAddItem = () => {
    const { timeRange = ['00:00', '00:00'], workDays = [] } = this.props.defaultAddTime || {};
    const value = this.getData();
    const disabledDays = this.getDisabledDays();
    const diffDays = difference(workDays, disabledDays);

    value.push({
      _init_: true,
      active: true,
      timeRange,
      workDays: diffDays,
    });

    this.props.onChange(value);
  };

  render() {
    const { prefix, className } = this.props;
    const { value } = this.props;
    const NS = cx(prefix, className);

    let canAdd = true;
    const disabledDays = this.getDisabledDays();

    canAdd = value.every(item => !item.active) && disabledDays.length < 7;

    return (
      <div className={NS}>
        {value.map((item, idx) => {
          return (
            <TimePickerItem
              key={idx}
              value={item}
              values={value}
              disabledDays={disabledDays}
              onChange={data => {
                this.handeChange(data, idx);
              }}
            />
          );
        })}
        {canAdd && (
          <div className={`${NS}__add`} onClick={this.handleAddItem}>
            新增时间段
          </div>
        )}
      </div>
    );
  }
}
