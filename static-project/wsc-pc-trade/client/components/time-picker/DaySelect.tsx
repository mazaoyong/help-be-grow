import React, { Component } from 'react';
import cx from 'classnames';
import keys from 'lodash/keys';

const IDX_MAP = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
  4: '五',
  5: '六',
  6: '日',
};

const DAYS = keys(IDX_MAP).map(id => ({ id: parseInt(id), text: `周${IDX_MAP[id]}` }));

interface IProps {
  prefix?: string;
  className?: string;
  active: boolean;
  selectedDays: number[];
  disabledDays: number[];
  onChange: (value: number[]) => void;
}

/**
 * 右侧周日期选择组件
 */
export default class DaySelect extends Component<IProps> {
  static defaultProps = {
    prefix: 'custom-time-picker-item__week',
    disabledDays: [],
    selectedDays: [],
  };

  handleClick = (id: number) => {
    const { selectedDays, onChange } = this.props;
    const copyedSelectedDays = selectedDays.slice();
    const idIndex = copyedSelectedDays.indexOf(id);

    if (idIndex > -1) {
      // 取消选择某个日期
      copyedSelectedDays.splice(idIndex, 1);
    } else {
      // 选择某个日期
      copyedSelectedDays.push(id);
    }

    copyedSelectedDays.sort();

    onChange(copyedSelectedDays);
  };

  /**
   * 渲染编辑状态
   */
  renderEdit() {
    const { prefix, disabledDays, selectedDays } = this.props;

    const res = DAYS.map((day, idx) => {
      const dayCls = cx(`${prefix}-day edit`, {
        active: selectedDays.indexOf(day.id) > -1,
      });

      return (
        <button
          key={idx}
          type="button"
          disabled={disabledDays.indexOf(day.id) > -1}
          className={dayCls}
          onClick={() => {
            this.handleClick(day.id);
          }}
        >
          {day.text}
        </button>
      );
    });

    return res;
  }

  /**
   * 渲染展示状态
   */
  renderView() {
    const { selectedDays } = this.props;

    return DAYS.filter(day => selectedDays.indexOf(day.id) > -1)
      .map(day => day.text)
      .join('、');
  }

  render() {
    const { prefix, className, active } = this.props;
    const cls = cx(prefix, className);

    return <div className={cls}>{!active ? this.renderView() : this.renderEdit()}</div>;
  }
}
