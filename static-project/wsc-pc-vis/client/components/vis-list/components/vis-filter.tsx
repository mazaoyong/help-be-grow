import { DateRangePicker, Select } from '@zent/compat';
import { Location } from 'history';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import get from 'lodash/get';
import React, { Component, ReactNode, KeyboardEvent } from 'react';
import { Checkbox, DateRangeQuickPicker, Input } from 'zent';
import TimeRangePicker from 'components/time-range-picker';
import {
  IFilterChangeConf,
  IFilterMethod,
  IFilterOptsItem,
  IVisListFilterProps,
} from '../ultis/type';
import qs from 'qs';

export default class VisFilter extends Component<IVisListFilterProps, any> {
  static defaultProps: Readonly<IVisListFilterProps> = {
    defaultValue: {},
    hides: {},
    options: null,
  };

  constructor(props: IVisListFilterProps) {
    super(props);
    const { location } = props;
    let queryValue: object | null = Object.create(null);
    if (location) {
      queryValue = pick(
        (this.props.location as Location).query,
        (this.props.options as any[]).map(i => i.name),
      );
    } else {
      queryValue = qs.parse(window.location.search);
    }

    this.state = {
      chooseDays: null,
      value: {
        ...this.props.defaultValue,
        // ...formatter(queryValue, true),
        ...queryValue,
      },
    };
  }

  onFilterChange(name: string, otherConf?: IFilterChangeConf) {
    const { onChange } = this.props;
    let value: any = null;
    if (otherConf) {
      const { data, date } = otherConf;
      value = data && data.value;
      if (date) {
        value = date;
      }
    }
    value = assign({}, this.state.value, { [name]: value });
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  }

  renderCustom(item: any) {
    const { value = {} } = this.state;
    const { component: Comp, format, name, label, ...restProps } = item;
    const handleChange = (...args) => {
      if (format) {
        format(...args).then(data => this.onFilterChange(name, { data }));
      } else {
        this.onFilterChange(name, { data: args[0] });
      }
    };
    return (
      <div className="vis-filter_item" key={name}>
        <label className="vis-filter_label">{label}</label>
        <div className="vis-filter_controls">
          <Comp width={185} {...restProps} value={value[name]} values={value} onChange={handleChange} />
        </div>
      </div>
    );
  }

  renderBr() {
    return <br key={new Date().getTime()} />;
  }

  renderSelect(item) {
    const { value = {} } = this.state;
    return (
      <div className="vis-filter_item" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls">
          <Select
            placeholder="全部"
            width={185}
            {...item.props}
            data={item.data}
            value={value[item.name]}
            onChange={(_, data) => this.onFilterChange(item.name, { data })}
          />
        </div>
      </div>
    );
  }

  renderInput(item) {
    const { value = {} } = this.state;
    return (
      <div className="vis-filter_item" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls" style={{ width: item.width }}>
          <Input
            placeholder={item.placeholder || '搜索'}
            width={185}
            {...item.props}
            value={value[item.name] || ''}
            onChange={evt => this.onFilterChange(item.name, { data: { value: evt.target.value! } })}
          />
        </div>
      </div>
    );
  }

  renderCheckbox(item) {
    const { value = {} } = this.state;
    return (
      <div className="vis-filter_item" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls">
          <Checkbox
            {...item.props}
            checked={!!value[item.name]}
            onChange={evt => this.onFilterChange(item.name, { data: { value: evt.target.value as string } })}
          />
        </div>
      </div>
    );
  }

  renderDateRangePicker(item) {
    const { value = [] } = this.state;
    return (
      <div className="vis-filter_item" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls date-range-picker-wrapper">
          <DateRangePicker
            {...item.props}
            value={value[item.name] || []}
            onChange={date => this.onFilterChange(item.name, { date } as any)}
          />
        </div>
      </div>
    );
  }

  renderDateRangeQuickPicker(item) {
    const { value = [] } = this.state;
    return (
      <div className="vis-filter_item date-range-quick-picker" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls date-range-quick-picker-wrapper">
          <DateRangeQuickPicker
            {...item.props}
            value={value[item.name] || []}
            chooseDays={this.state.chooseDays}
            onChange={(date, chooseDays) => this.onFilterChange(item.name, { date, chooseDays } as any)}
          />
        </div>
      </div>
    );
  }

  renderTimeRangePicker(item) {
    const { value = [] } = this.state;
    return (
      <div className="vis-filter_item" key={item.name}>
        <label className="vis-filter_label">{item.label}</label>
        <div className="vis-filter_controls date-range-quick-picker-wrapper">
          <TimeRangePicker
            value={value[item.name]}
            onChange={date => this.onFilterChange(item.name, { date } as any)}
          />
        </div>
      </div>
    );
  }

  renderItem(item: IFilterOptsItem) {
    const items = {
      Checkbox: this.renderCheckbox,
      DateRangePicker: this.renderDateRangePicker,
      DateRangeQuickPicker: this.renderDateRangeQuickPicker,
      Input: this.renderInput,
      Select: this.renderSelect,
      Custom: this.renderCustom,
      Br: this.renderBr,
      TimeRangePicker: this.renderTimeRangePicker,
    };
    const itemWithDefaultProps = item;
    // 添加组件的默认宽度为200px
    if (!get(itemWithDefaultProps, 'props.width')) {
      itemWithDefaultProps.props = Object.assign({}, { width: '185px ' }, itemWithDefaultProps.props);
    }
    if (items[item.type]) {
      return items[item.type].call(this, itemWithDefaultProps);
    }
    return null;
  }

  // tslint:disable-next-line:member-ordering
  filter: IFilterMethod = {
    data: () => this.state.value,
    reset: () => this.setState({ value: this.props.defaultValue }, () => this.filter.submit()),
    submit: () => {
      const { push, location, onSubmit, defaultValue, options } = this.props;
      const { value } = this.state;

      if (onSubmit) {
        onSubmit(value);
      }
      if (push) {
        // TODO location.query has no prototype after v3.0.0 in history.
        const { query = {} } = location as Location;
        const isReset = isEqual(value, defaultValue);
        let searchQuery = isReset ? defaultValue : value;
        const irrelevantQuery = omit(query, (options || []).map(opt => opt.name));
        if (isReset && options) {
          options.map(opt => {
            delete query[opt.name];
          });
        }

        const mergedObject = Object.assign(irrelevantQuery, query, searchQuery);

        push(Object.assign(mergedObject, { pageNumber: 1 }));
      }
    },
  };

  renderBottomAction(btm: (...arg: any) => ReactNode): ReactNode {
    if (typeof btm === 'function') {
      return btm(this.filter);
    } else {
      // tslint:disable-next-line:max-line-length
      throw new Error(
        '[vis-filter]: prop-bottomActions required function-type value, please check the type of this property',
      );
    }
  }

  // 监听回车事件
  handlePressEnter = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.charCode === 13) {
      this.filter.submit();
    }
  }

  render() {
    const { options, hides = {}, children, bottomActions } = this.props;

    if (options) {
      return (
        <div className="vis-filter_region" onKeyPressCapture={this.handlePressEnter}>
          <div className="vis-filter_group clearfix">
            {options.map(item => hides[item.name] || this.renderItem(item))}
          </div>
          <div className="vis-filter_action">{children}</div>
          <div className="vis-filter_bottom">
            {this.renderBottomAction(bottomActions as (...arg: any) => ReactNode)}
          </div>
        </div>
      );
    }
    return null;
  }
}
