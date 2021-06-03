import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'zent';

import './style/index.scss';

class ComponentTip extends (PureComponent || Component) {
  static propTypes = {
    tip: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    tip: '',
    className: '',
  };

  render() {
    const { tip, className } = this.props;
    const cls = cx('rc-design-preview-component-tip', className);

    return (
      <div className={cls}>
        <Icon type="error-circle-o" />
        <span>{tip}</span>
      </div>
    );
  }
}

export default ComponentTip;
