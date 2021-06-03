import { Select, DateRangePicker } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, DateRangeQuickPicker } from 'zent';
import assign from 'lodash/assign';

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
export default class Filter extends Component {
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

  onCustomChange(data, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: data.value }));
  }

  onSelectChange(data, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: data.value }));
  }

  onInputChange(evt, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: evt.target.value }));
  }

  onCheckboxChange(evt, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: evt.target.checked }));
  }

  onDateRangePickerChange(data, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: data }));
  }

  onDateRangeQuickPickerChange(data, chooseDays, name) {
    this.props.onChange(assign({}, this.props.value, { [name]: data }));
    this.setState({
      chooseDays,
    });
  }

  renderSelect(item) {
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

  renderInput(item) {
    return (
      <div className="new-filter_item" key={item.name}>
        <label className="new-filter_label">{item.label}</label>
        <div className="new-filter_controls">
          <Input
            {...item.props || { placeholder: '搜索' }}
            value={this.props.value[item.name]}
            width={100}
            {...item.props}
            onChange={evt => this.onInputChange(evt, item.name)}
            onPressEnter={() => {
              this.props.onSubmit && this.props.onSubmit();
            }}
          />
        </div>
      </div>
    );
  }

  renderCheckbox(item) {
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

  renderDateRangePicker(item) {
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

  renderDateRangeQuickPicker(item) {
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

  renderCustomer(item) {
    const { component: Comps, name, label, data, props } = item;
    return (
      <div className="new-filter_item" key={name}>
        <label className="new-filter_label">{label}</label>
        <div className="new-filter_controls">
          <Comps
            data={data}
            value={this.props.value[name]}
            {...props}
            onChange={(_, data) => this.onCustomChange(data, name)}
          />
        </div>
      </div>
    );
  }

  renderItem(item) {
    const items = {
      Select: this.renderSelect,
      Input: this.renderInput,
      Checkbox: this.renderCheckbox,
      DateRangePicker: this.renderDateRangePicker,
      DateRangeQuickPicker: this.renderDateRangeQuickPicker,
      Custom: this.renderCustomer,
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
