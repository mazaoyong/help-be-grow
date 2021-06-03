import React, { Component, PureComponent } from 'react';
import { Checkbox, Radio, Select, Pop } from 'zent';
import { Form } from '@zent/compat';
import { times } from 'lodash';
import { BlankLink } from '@youzan/react-components';
import './styles.scss';

const { getControlGroup } = Form;

const RadioGroup = Radio.Group;

// 提前打印小票设置时间总次数
const PRINT_TICKET_REPEAT_TIME = 16;
// 提前打印小票设置时间间隔（15分钟）
const PRINT_TICKET_DURATION = 15;
const timeStepper = times(PRINT_TICKET_REPEAT_TIME, v => {
  const totalMinutes = (v + 1) * PRINT_TICKET_DURATION;
  const displayHour = Math.floor(totalMinutes / 60);
  const displayMinute = totalMinutes % 60;
  return {
    text: `${displayHour ? `${displayHour}小时` : ''}${
      displayMinute ? `${displayMinute}分钟` : ''
    }`,
    // 以秒单位传给后端
    value: totalMinutes * 60,
  };
});

const Tip = () => {
  return (
    <p className="tip">
      开启后，请在“打印设置-
      <BlankLink href="/v2/setting/store/receipt">收银小票</BlankLink>
      ”中设置拣货小票打印规则，系统会根据销售发货单自动打印拣货小票。
      <BlankLink href="https://help.youzan.com/displaylist/detail_5_5-2-45500">
        如何设置拣货小票打印规则？
      </BlankLink>
    </p>
  );
};

const Panel = ({ onChange, checked }) => {
  return (
    <div className="ticket-print-config-wrapper">
      <h3 className="title">小票打印设置</h3>
      <div className="content">
        <p>拣货小票：</p>
        <div className="ticket-print-config-core">
          <Checkbox checked={checked} onChange={onChange}>
            支付成功时，自动打印
          </Checkbox>
          <Tip />
        </div>
      </div>
    </div>
  );
};

class Field extends (PureComponent || Component) {
  constructor(props) {
    super(props);

    const { value } = props;
    // 后端给的是字符串，转换下
    if (value && value.aheadTime) {
      value.aheadTime = +value.aheadTime;
    }
    this.state = {
      needAutoPrint: 0,
      autoPrintOption: 0,
      aheadTime: timeStepper[0].value,
      ...value,
    };

    // 初始化设置下外部的 value
    this.asyncFormData();
  }

  onCheckBokChange = e => {
    this.setState(
      {
        needAutoPrint: e.target.checked ? 1 : 0,
      },
      this.asyncFormData,
    );
  };

  onRadioChange = e => {
    this.setState(
      {
        autoPrintOption: e.target.value,
        // 默认 15 分钟（900秒）
        aheadTime: 900,
      },
      this.asyncFormData,
    );
  };

  onAheadTimeChange = e => {
    this.setState(
      {
        aheadTime: e.target.value,
      },
      this.asyncFormData,
    );
  };

  asyncFormData = () => {
    // 同城配送
    this.props.onChange && this.props.onChange(this.state);
    // 上门自提
    this.props.input && this.props.input.onChange(this.state);
  };

  componentWillReceiveProps = nextProps => {
    const { canSelectAll } = nextProps;

    // 如果只能选第一项（没有开启定时达），强制改成选择第一项
    if (!canSelectAll) {
      this.setState(
        {
          autoPrintOption: 0,
        },
        this.asyncFormData,
      );
    }
  };

  render() {
    const { needAutoPrint, autoPrintOption, aheadTime } = this.state;
    const isNeedAutoPrint = needAutoPrint === 1;
    const { canSelectAll, type } = this.props;
    const defaultAheadTime = timeStepper[0].value;
    const typeText = type === 'self-fetch' ? '自提' : '送达';
    const tooltipText =
      type === 'self-fetch'
        ? '自提时间开启需要买家选择时，可选择设置提前打印时间。'
        : '开启定时达功能后，可选择设置提前打印时间。';
    return (
      <div className="ticket-print-config-core">
        <Checkbox checked={isNeedAutoPrint} onChange={this.onCheckBokChange}>
          开启自动打印
        </Checkbox>
        {isNeedAutoPrint && (
          <div className="select-group">
            <RadioGroup value={autoPrintOption} onChange={this.onRadioChange}>
              <div className="select-item">
                <Radio value={0}>支付成功时，自动打印</Radio>
              </div>
              <div className="select-item">
                <Pop trigger="hover" position="top-center" content={tooltipText}>
                  <div>
                    <Radio value={1} disabled={!canSelectAll}>
                      根据预约{typeText}开始时间，提前
                      <Select
                        width={130}
                        data={timeStepper}
                        value={autoPrintOption === 1 ? aheadTime : defaultAheadTime}
                        onChange={this.onAheadTimeChange}
                        disabled={autoPrintOption !== 1}
                      />
                      自动打印
                    </Radio>
                  </div>
                </Pop>
              </div>
              <div className="select-item">
                <Pop trigger="hover" position="top-center" content={tooltipText}>
                  <div>
                    <Radio value={2} disabled={!canSelectAll}>
                      根据预约{typeText}结束时间，提前
                      <Select
                        width={130}
                        data={timeStepper}
                        value={autoPrintOption === 2 ? aheadTime : defaultAheadTime}
                        onChange={this.onAheadTimeChange}
                        disabled={autoPrintOption !== 2}
                      />
                      自动打印
                    </Radio>
                  </div>
                </Pop>
              </div>
            </RadioGroup>
          </div>
        )}
        <Tip />
      </div>
    );
  }
}

export default {
  Panel,
  Field: getControlGroup(Field),
};
