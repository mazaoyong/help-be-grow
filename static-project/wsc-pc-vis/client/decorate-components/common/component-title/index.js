import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { BlankLink } from '@youzan/react-components';
import bem from '../../utils/bem';
import './style/index.scss';

const b = bem('deco-component-title');

class ComponentTitle extends (PureComponent || Component) {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    urls: PropTypes.array,
    noticeMsg: PropTypes.any,
    withMargin: PropTypes.bool,
    footer: PropTypes.any,
  };

  static defaultProps = {
    className: '',
    style: {},
    url: '',
    noticeMsg: '',
    withMargin: false,
  };

  renderLinks() {
    const { url, urls } = this.props;
    let list = urls;

    if (!url && !urls) {
      return null;
    }

    if (url) {
      list = [{ name: '查看教程', href: url }];
    }

    return list.map((item, index) => (
      <BlankLink key={index} className={b('link')} href={item.href}>
        {item.name}
      </BlankLink>
    ));
  }

  render() {
    const { className, style, name, noticeMsg, withMargin, footer } = this.props;
    const cls = cx(b(), className, {
      [b('', 'with-margin')]: withMargin,
    });

    return (
      <div className={cls} style={style}>
        <div className={b('header')}>
          <span className={b('name')}>{name}</span>
          {this.renderLinks()}
        </div>
        {noticeMsg && <div className={b('msg')}>{noticeMsg}</div>}
        {footer}
      </div>
    );
  }
}

export default ComponentTitle;
