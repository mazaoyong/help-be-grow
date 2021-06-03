import React, { Component, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class VuePreview extends (PureComponent || Component) {
  static propTypes = {
    // 用来渲染的 Vue 组件
    vueComponent: PropTypes.any,

    // Vue 组件的参数
    value: PropTypes.object,

    // 用户自定义配置
    globalConfig: PropTypes.object,

    // 传给 Vue 组件的 children，不需要就不要传
    // 下面这段代码里面的那段中文就应该作为 children 传进去
    // <cap-notice-bar mode="closeable">
    //  自2017年6月1日起，发票将根据业务类型由杭州起码科技有限公司
    // </cap-notice-bar>
    vueChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;

    return <div className={cx('rc-design-vue-preview', className)} />;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.vueComponent !== nextProps.vueComponent) {
      this.destroyVueComponent();
    }
  }

  componentDidMount() {
    this.renderVueComponent();
  }

  componentDidUpdate() {
    this.renderVueComponent();
  }

  componentWillUnmount() {
    this.destroyVueComponent();
  }

  destroyVueComponent() {
    if (this.vueInstance) {
      const el = this.vueInstance.$el;

      this.vueInstance.$destroy(true);
      el.parentNode.removeChild(el);

      this.vueInstance = undefined;
      this.vueMountPoint = undefined;
    }
  }

  renderVueComponent() {
    // Vue mount 的时候会把整个节点替换掉，所以动态插入一个节点
    if (!this.vueMountPoint) {
      const node = findDOMNode(this);
      if (!node) {
        return;
      }

      this.vueMountPoint = document.createElement('div');
      node.appendChild(this.vueMountPoint);
    }

    const { vueComponent: VC, value, globalConfig, vueChildren } = this.props;
    if (!this.vueInstance) {
      this.vueInstance = new VC({
        propsData: {
          options: value,
          globalConfig,
          children: vueChildren,
        },

        el: this.vueMountPoint,
      });
    } else {
      this.vueInstance.$props.options = value;
      this.vueInstance.$props.children = vueChildren;
      this.vueInstance.$forceUpdate();
    }
  }
}
