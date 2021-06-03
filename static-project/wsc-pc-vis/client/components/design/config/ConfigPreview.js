import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class ConfigPreview extends (PureComponent || Component) {
  static propTypes = {
    value: PropTypes.object,

    // 用来和 Design 交互
    design: PropTypes.object,

    appType: PropTypes.oneOf(['wechat', 'weapp']),

    showNewMarker: PropTypes.bool,
  };

  static defaultProps = {
    appType: 'weapp',
    showNewMarker: true,
  };

  /**
   * 用途: js中字符串超长作固定长度加省略号（...）处理
   * str: 需要进行处理的字符串，可含汉字
   * len: 需要显示多少个字符
   */
  beautySub(str, len) {
    const slice = str.substring(0, len);
    return `${slice}...`;
  }

  getTitle(title) {
    const len = title.length;
    if (len === 0) {
      return '请点击此处编辑标题';
    } else if (len > 8) {
      return this.beautySub(title, 8);
    }
    return title;
  }

  render() {
    const { value, appType, showNewMarker } = this.props;
    const { title } = value;
    const omitTitle = this.getTitle(title);

    return (
      <div
        className={cx('rc-design-component-config-preview', {
          'rc-design-component-config-preview--wechat': appType === 'wechat',
          'rc-design-component-config-preview--weapp': appType === 'weapp',
          'rc-design-component-config-preview--new': showNewMarker,
        })}
      >
        <div className="rc-design-component-config-preview__title">{omitTitle}</div>
      </div>
    );
  }
}
