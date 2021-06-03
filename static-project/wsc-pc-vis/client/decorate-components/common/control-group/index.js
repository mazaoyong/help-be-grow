import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'zent';
import isUndefined from 'lodash/isUndefined';
import HelpDesc from '../help-desc';
import bem from '../../utils/bem';

import './style/index.scss';

const prefix = 'deco-control-group';
const b = bem(prefix);

export default class ControlGroup extends React.PureComponent {
  static propTypes = {
    showError: PropTypes.bool, // 是否显示错误信息
    error: PropTypes.node, // 错误信息
    showLabel: PropTypes.bool, // 是否显示标签
    helpDesc: PropTypes.node, // 帮助提示
    label: PropTypes.node, // 标签名
    normalAlign: PropTypes.bool, // 内容是否正常对齐。仅内联模式生效，即 block: false
    block: PropTypes.bool, // 是否标签独占一行
    value: PropTypes.node, // 值
    extra: PropTypes.node, // 额外的东西
    focusOnLabelClick: PropTypes.bool, // 点击 label 区域时是否 focus 到 control 的 input 上
    required: PropTypes.bool, // 是否必须。会在标签前方增加红色星星图标
    className: PropTypes.string, // 自定义类名
    style: PropTypes.object, // 样式
    children: PropTypes.any,
    bgColored: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // 背景着色。设为 true，则会给个统一的背景色，也可以自定义颜色
    contentColored: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // 内容区着色。同上
    labelColored: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // 标签着色。同上
    labelAlign: PropTypes.oneOf(['center', 'top', 'bottom', 'max-top']), // 标签位置。仅内联模式有效，value 和 extra 始终会跟 label 在同一行
  };

  static defaultProps = {
    required: false,
    showError: false,
    showLabel: true,
    focusOnLabelClick: false,
    error: '',
    block: false,
    normalAlign: false,
    bgColored: false,
    contentColored: false,
    labelColored: false,
    labelAlign: 'center',
    style: {},
  };

  // 获取 control-group 的 style
  getStyleObj = () => {
    const { style, bgColored } = this.props;
    const res = { ...style };

    if (typeof bgColored === 'string' && bgColored) {
      res.backgroundColor = bgColored;
    }

    return res;
  };

  // 获取内容区域的 style
  getContentStyleObj = () => {
    const { contentColored } = this.props;
    const res = {};

    if (typeof contentColored === 'string' && contentColored) {
      res.backgroundColor = contentColored;
    }

    return res;
  };

  // 获取标签的 style
  getLabelStyleObj = () => {
    const { labelColored } = this.props;
    const res = {};

    if (typeof labelColored === 'string' && labelColored) {
      res.color = labelColored;
    }

    return res;
  };

  // 渲染头部区域
  renderHeader() {
    const {
      labelAlign,
      block,
      showLabel,
      required,
      labelColored,
      label,
      value,
      extra,
    } = this.props;
    const labelVisible = showLabel && label;

    return (
      <div
        className={cx(b('header'), {
          [b('header', labelAlign)]: !block,
        })}
      >
        {labelVisible && (
          <div
            className={cx(b('label'), {
              [b('label', 'colored')]: labelColored === true,
            })}
            style={this.getLabelStyleObj()}
          >
            {required && <Icon className={b('required-star')} type="star" />}
            {label}
          </div>
        )}
        {!isUndefined(value) && <div className={b('value')}>{value}</div>}
        {!isUndefined(extra) && <div className={b('extra')}>{extra}</div>}
      </div>
    );
  }

  // 渲染内容区
  renderContent() {
    const { normalAlign, contentColored, children } = this.props;

    return (
      <div
        className={cx(b('content'), {
          [b('content', 'normal-align')]: normalAlign,
          [b('content', 'colored')]: contentColored === true,
        })}
        style={this.getContentStyleObj()}
      >
        {children}
      </div>
    );
  }

  // 渲染提示
  renderTips() {
    const { helpDesc } = this.props;
    return helpDesc && <HelpDesc className={b('tips')}>{helpDesc}</HelpDesc>;
  }

  // 渲染错误描述
  renderError() {
    const { error } = this.props;
    return (
      error && (
        <HelpDesc className={b('error')} type="error">
          {error}
        </HelpDesc>
      )
    );
  }

  render() {
    const {
      className,
      showError,
      error,
      showLabel,
      label,
      block,
      value,
      extra,
      helpDesc,
      children,
      focusOnLabelClick,
      bgColored,
    } = this.props;
    const NodeName = focusOnLabelClick ? 'label' : 'div';
    const headerVisible = (showLabel && label) || value || extra;
    const contentVisible = !!children;
    const tipsVisible = !!helpDesc;
    const containerVisible = headerVisible || contentVisible || (tipsVisible && block);
    const errorVisible = showError && error;

    return (
      <div
        className={cx(b(), className, {
          [`${b(['error'])} has-error`]: errorVisible,
          [b(['bg-colored'])]: bgColored === true,
        })}
        style={this.getStyleObj()}
      >
        {containerVisible && (
          <NodeName
            className={cx(`${prefix}-container`, { [`${prefix}-container--block`]: block })}
          >
            {headerVisible && this.renderHeader()}
            {tipsVisible && block && this.renderTips()}
            {contentVisible && this.renderContent()}
          </NodeName>
        )}

        {tipsVisible && !block && this.renderTips()}
        {showError && this.renderError()}
      </div>
    );
  }
}
