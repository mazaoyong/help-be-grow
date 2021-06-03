import { Component } from 'react';
import PropTypes from 'prop-types';
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
    static propTypes: {
        options: PropTypes.Requireable<any[]>;
        value: PropTypes.Requireable<object>;
        hides: PropTypes.Requireable<object>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        onSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        children: PropTypes.Requireable<PropTypes.ReactElementLike | (PropTypes.ReactElementLike | null | undefined)[]>;
    };
    static defaultProps: {
        options: never[];
        hides: {};
        value: {};
    };
    state: {
        chooseDays: null;
    };
    onSelectChange(data: {
        value: any;
    }, name: string): void;
    onInputChange(evt: {
        target: {
            value: any;
        };
    }, name: string): void;
    onCheckboxChange(evt: any, name: string): void;
    onDateRangePickerChange(data: any, name: string): void;
    onDateRangeQuickPickerChange(data: any, chooseDays: number | undefined, name: any): void;
    renderSelect(item: any): JSX.Element;
    renderInput(item: any): JSX.Element;
    renderCheckbox(item: any): JSX.Element;
    renderDateRangePicker(item: any): JSX.Element;
    renderDateRangeQuickPicker(item: any): JSX.Element;
    renderItem(item: any): any;
    render(): JSX.Element;
}
