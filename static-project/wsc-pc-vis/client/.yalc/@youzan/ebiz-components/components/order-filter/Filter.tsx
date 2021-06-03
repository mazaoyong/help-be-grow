import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Checkbox, DateRangePicker, DateRangeQuickPicker } from 'zent';
import assign from 'lodash/assign';
import { IOrderFilter } from './types';

/**
 * 知识付费通用搜索条件
 *
 * @class Filter
 * @extends {Component}
 * @prop {object} options 搜索条件配置，目前仅有 input/select/checkbox,通 type、name、label、data, props 配置
 * @prop {object} value 值
 * @prop {object} hides 需要隐藏的元素
 * @event {object} onChange 更改后的值，把所有 value 的字段输出
 * @example
 * // options
 * [{
    type: 'select',
    name: 'status',
    label: '售卖状态：',
    data: [{
      value: '0',
      text: '全部'
    }, {
      value: '1',
      text: '更新中'
    }, {
      value: '2',
      text: '停止更新'
    }],
    props: {
      placeholder: '全部'
    }
  }, {
    type: 'input',
    name: 'keyword',
    label: '专栏名称：',
  }

  // value
  {
    status: '0',
    keyword: 'hello'
  }

  // hides
  {
    keyword: true
  }
 */
export default class Filter extends Component<IOrderFilter> {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.object,
    hides: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };

  static defaultProps = {
    options: [],
    hides: {},
    value: {},
  };

  state = {
    chooseDays: null,
  };

  onSelectChange(data: { value: any; }, name: string) {
    this.props.onChange(assign({}, this.props.value, { [name]: data.value }));
  }

  onInputChange(evt: { target: { value: any; }; }, name: string) {
    this.props.onChange(assign({}, this.props.value, { [name]: evt.target.value }));
  }

  onCheckboxChange(evt: any, name: string) {
    this.props.onChange(assign({}, this.props.value, { [name]: evt.target.checked }));
  }

  onDateRangePickerChange(data: any, name: string) {
    this.props.onChange(assign({}, this.props.value, { [name]: data }));
  }

  onDateRangeQuickPickerChange(data: any, chooseDays: number | undefined, name: any) {
    this.props.onChange(assign({}, this.props.value, { [name]: data }));
    this.setState({
      chooseDays,
    });
  }

  renderSelect(item: any) {
    return (
      <div className="new-filter_item" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls">
          <Select
            data={item.data}
            value={this.props.value[item.name]}
            {...item.props || { placeholder: '全部' }}
            width={100}
            {...item.props}
            onChange={(_, data) => this.onSelectChange(data, item.name)}
          />
        </div>
      </div>
    );
  }

  renderInput(item: any) {
    return (
      <div className="new-filter_item" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls">
          <Input
            {...item.props || { placeholder: '搜索' }}
            value={this.props.value[item.name]}
            width={100}
            {...item.props}
            onChange={(evt: { target: { value: any; }; }) => this.onInputChange(evt, item.name)}
            onPressEnter={() => {
              this.props.onSubmit && this.props.onSubmit();
            }}
          />
        </div>
      </div>
    );
  }

  renderCheckbox(item: any) {
    return (
      <div className="new-filter_item" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls">
          <Checkbox
            {...item.props}
            checked={!!this.props.value[item.name]}
            {...item.props}
            onChange={evt => this.onCheckboxChange(evt, item.name)}
          />
        </div>
      </div>
    );
  }

  renderDateRangePicker(item: any) {
    return (
      <div className="new-filter_item" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls date-range-picker-wrapper">
          <DateRangePicker
            value={this.props.value[item.name] || []}
            {...item.props}
            onChange={data => this.onDateRangePickerChange(data, item.name)}
          />
        </div>
      </div>
    );
  }

  renderDateRangeQuickPicker(item: any) {
    return (
      <div className="new-filter_item date-range-quick-picker" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls date-range-quick-picker-wrapper">
          <DateRangeQuickPicker
            value={this.props.value[item.name] || []}
            chooseDays={this.state.chooseDays}
            {...item.props}
            onChange={(data, chooseDays) =>
              this.onDateRangeQuickPickerChange(data, chooseDays, item.name)
            }
          />
        </div>
      </div>
    );
  }

  renderItem(item: any) {
    const items: any = {
      Select: this.renderSelect,
      Input: this.renderInput,
      Checkbox: this.renderCheckbox,
      DateRangePicker: this.renderDateRangePicker,
      DateRangeQuickPicker: this.renderDateRangeQuickPicker,
    };
    if (items[item.type]) {
      return items[item.type].call(this, item);
    }
    return null;
  }

  render() {
    const { options, hides } = this.props;
    return (
      <div className="new-filter_region">
        <div className="new-filter_group clearfix">
          {options.map(item => {
            return hides[item.name] || this.renderItem(item);
          })}
        </div>
        <div className="new-filter_action">{this.props.children}</div>
      </div>
    );
  }
}
