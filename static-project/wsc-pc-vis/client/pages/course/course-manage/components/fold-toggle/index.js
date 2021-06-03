
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Icon } from 'zent';
import cx from 'classnames';

const { getControlGroup } = Form;

class FoldToggle extends Component {
  handleClick = () => {
    let { value } = this.props;
    this.props.onChange(value ? 0 : 1);
  };

  render() {
    let { value } = this.props;
    let isOpen = Boolean(value);
    return (
      <div className="fold-field" onClick={this.handleClick}>
        <Icon
          type="caret-down"
          className={cx({
            'fold-field__icon': true,
            'is-close': !isOpen,
          })}
        />
        <a className="fold-field__txt" >
          {isOpen ? '折叠更多设置' : '更多设置'}
        </a>
      </div>
    );
  }
}

export default getControlGroup(FoldToggle);
