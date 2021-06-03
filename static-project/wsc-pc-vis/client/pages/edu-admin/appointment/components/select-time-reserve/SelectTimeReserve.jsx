import { Popover } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Input, Icon } from 'zent';
import classNames from 'classnames';

import { genQuarterAllDay, formatMinutesToHHMM } from '../../utils';
import makeDateTimeStr from 'zan-utils/date/makeDateTimeStr';
// 引入样式
import './style.scss';

const quarters = genQuarterAllDay();
const dateNow = Date.now();
const now = makeDateTimeStr(
  dateNow % (15 * 60 * 1000) === 0 ? dateNow + 60 * 1000 : dateNow,
  'HH:mm', // 刚好等于15刻度的情况多加一分钟
);
const nowQuarter = formatMinutesToHHMM(now.slice(0, 2) * 60 + Math.ceil(now.slice(-2) / 15) * 15);
const nowQuarterIndex = quarters.indexOf(nowQuarter);

export default class SelectTimeReserve extends Component {
  state = {
    visible: false,
    choosedTime: '',
  };

  selectTime = () => {
    const { onChange } = this.props;
    const { choosedTime } = this.state;
    // confirm
    onChange(choosedTime, true);
    this.setState({ visible: false });
  };

  onChangeTime = (time, disable) => {
    if (disable) return;
    this.setState({ choosedTime: time });
  };

  onCloseTime = () => {
    const { value } = this.props;
    this.setState({ visible: false, choosedTime: value });
  };

  togglePopState = visible => {
    const { canChoose } = this.props;
    this.setState({ visible: visible && canChoose });
  };

  componentDidMount() {
    const { value } = this.props;
    this.onChangeTime(value);
  }

  render() {
    const { choosedTime, visible } = this.state;
    const {
      value,
      isToday,
      canChoose,
      noDisable,
      endDisableValue = '',
      placeholder,
      width,
      disabled, // 添加disabled属性
    } = this.props;
    let endQuarterIndex = quarters.indexOf(endDisableValue) + 1;
    if (isToday && endQuarterIndex === 0) endQuarterIndex = nowQuarterIndex;
    const selectValue = quarters.indexOf(value) > -1 ? value : '';
    return (
      <div className="select-time-reserve">
        <Popover
          visible={visible}
          onVisibleChange={visible => this.setState({ visible: disabled ? false : visible })}
          position={Popover.Position.BottomLeft}
          display="inline"
          cushion={5}
        >
          <Popover.Trigger.Click>
            <div className="select-input">
              <Input
                width={width}
                disabled={disabled}
                value={selectValue}
                readOnly={!disabled}
                className="remove-addon-bgc"
                placeholder={placeholder || '请选择时间'}
                onClick={() => this.togglePopState(true)}
              />
              <Icon className="zenticon" type="clock-o" />
            </div>
          </Popover.Trigger.Click>
          <Popover.Content>
            <div className="select-time-reserve__section">
              <div className="select-time-reserve__content">
                {quarters.map((quarter, index) => {
                  const itemClass = classNames({
                    'select-time-reserve__item': true,
                    'select-time-reserve__item-select': (choosedTime || value) === quarter,
                    'select-time-reserve__item-disabled':
                      (isToday || index < endQuarterIndex || !canChoose) && !noDisable, // date没有选的时候全部不可用
                  });

                  const disable = (isToday || index < endQuarterIndex || !canChoose) && !noDisable;
                  const clickEvent = !disable ? () => this.onChangeTime(quarter, false) : () => void 0;
                  return (
                    <div
                      key={index}
                      className={itemClass}
                      onClick={clickEvent}
                    >
                      {quarter}
                    </div>
                  );
                })}
              </div>
              <div className="select-time-reserve__actions">
                <Button type="primary" outline onClick={this.onCloseTime}>
                  取消
                </Button>
                <Button type="primary" onClick={this.selectTime}>
                  确定
                </Button>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    );
  }
}
