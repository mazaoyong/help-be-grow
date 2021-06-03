import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './style/index.scss';

class ComponentTitle extends (PureComponent || Component) {
  static propTypes = {
    name: PropTypes.string.isRequired,
    msg: PropTypes.string,
    className: PropTypes.string,
    url: PropTypes.string,
  };

  static defaultProps = {
    msg: '',
    className: '',
    url: '',
  };

  render() {
    const { name, noticeMsg, className, url } = this.props;
    const cls = cx('rc-design-editor-component-title', className);

    return (
      <div className={cls}>
        <span className="rc-design-editor-component-title__name">{name}</span>
        {url && (
          <span className="rc-design-editor-component-title__help">
            <a href={url} target="_blank" rel="noopener noreferrer">
              查看教程
            </a>
          </span>
        )}
        <span className="rc-design-editor-component-title__msg">{noticeMsg}</span>
      </div>
    );
  }
}

export default ComponentTitle;
