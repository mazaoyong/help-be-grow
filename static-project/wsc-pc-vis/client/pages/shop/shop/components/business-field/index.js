
import { Form } from '@zent/compat';
/**
 * 主营类目选择组件
 */
import React, { Component } from 'react';
import { Notify } from 'zent';

import cx from 'classnames';
import find from 'lodash/find';
import { style } from './index.scss';
import SelectBox from '../select-box';
import { getEduCategory } from '../../api';
const { getControlGroup } = Form;

class BusinessField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subScopeList: [],
    };
  }

  componentDidMount() {
    this._getScopeList().then(data => {
      this.setState({
        scopeList: this._formatScope(data),
      });
    });
  }

  _getScopeList() {
    return getEduCategory()
      .then(data => {
        return data;
      })
      .catch(msg => {
        Notify.error(msg || '数据加载失败');
      });
  }

  _formatScope(list) {
    return list;
  }

  _onScopeChange(data, params) {
    this.props.handleChange(data.id, params || {});
  }

  render() {
    const classes = [style];
    const businessScope = this.props.value;
    const subValue = find(this.state.subScopeList, { id: businessScope });
    const value =
      find(this.state.scopeList, {
        id: subValue ? subValue.parent_id : businessScope,
      }) || {};
    this.props.className && classes.push(this.props.className);
    const showError = this.props.isTouched && this.props.error;
    const className = cx({
      'team-category': true,
      'has-error': showError,
    });

    return (
      <div className={className}>
        <div className="zent-form__controls">
          <SelectBox
            data={this.state.scopeList}
            value={value.id}
            onChange={this._onScopeChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default getControlGroup(BusinessField);
