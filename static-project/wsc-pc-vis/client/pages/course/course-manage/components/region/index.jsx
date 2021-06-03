
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Icon } from 'zent';
import cx from 'classnames';
import Model from '../../common/model';

import './index.scss';

const { Field, getControlGroup } = Form;

/* export default props => (
  <div
    className={cx('goods-edit__region', props.className)}
    onClick={() => props.toggleRegion(props.config)}
  >
    <div className="goods-edit__region--inner">
      <div className="goods-edit__region-title">
        <div className="goods-edit__region-title--inner">{props.title}</div>
      </div>
      <div className={cx('goods-edit__region-content', { hide: +Model.get(props.config) !== 1 })}>
        <div className="goods-edit__region-content--inner">{props.children}</div>
      </div>
    </div>
  </div>
); */

class RegionBlock extends Component {
  state = {
    isOpen: true,
  };
  toggleRegion = key => {
    let { onChange } = this.props;
    let val = Model.get(key) ? 0 : 1;
    this.setState({
      isOpen: Boolean(val),
    });
    onChange(val);
  };
  render() {
    let { title, name } = this.props;
    let { isOpen } = this.state;
    return (
      <div onClick={() => this.toggleRegion(name)}>
        <div className="goods-edit__region-inner">
          <div className="goods-edit__region-title">
            <div className="goods-edit__region-title--inner">{title}</div>
          </div>
        </div>
        <div className="goods-edit__region-corner">
          <span className="fold-field__txt" href="javascript:;">
            {isOpen ? '收起' : '展开'}
          </span>
          <Icon
            type="caret-down"
            className={cx({
              'fold-field__icon': true,
              'is-close': !isOpen,
            })}
          />
        </div>
      </div>
    );
  }
}

const regionBlock = getControlGroup(RegionBlock);

export default class Region extends Component {
  render() {
    return (
      <Field
        name={this.props.name}
        value={this.props[this.props.name]}
        component={regionBlock}
        title={this.props.title}
        className="goods-edit__region  no-control-label"
      />
    );
  }
}
