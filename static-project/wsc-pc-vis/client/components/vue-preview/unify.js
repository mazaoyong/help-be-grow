import Vue from 'vue';
import { Lazyload } from 'vant';
import isFunction from 'lodash/isFunction';

Vue.use(Lazyload);

/**
 * 用来统一 Vue 组件的输入
 *
 * @param {*} component vue组件
 * @param {*} mapOptionsToProps A function to translate options into props
 * @param {*} mapOptionsToAttrs A function to translate options into attrs
 * @return {Object} vue组件
 */
export default function unify(component, mapOptionsToProps, mapOptionsToAttrs) {
  return Vue.extend({
    functional: true,

    props: {
      // Vue 组件的参数
      options: {
        type: Object,
        default() {
          return {};
        },
      },

      // 自定义配置
      globalConfig: {
        type: Object,
        default() {
          return {};
        },
      },

      // 有些情况下可能需要给 Vue 组件传 children
      // 注意这里的 children 必须是 Vue 的 VNode 或者字符串
      children: [String, Array],
    },

    render(h) {
      const props = isFunction(mapOptionsToProps)
        ? mapOptionsToProps(this.options, this.globalConfig)
        : this.options;
      const attrs = isFunction(mapOptionsToAttrs)
        ? mapOptionsToAttrs(this.options, this.globalConfig)
        : this.options;

      return h(
        component,
        {
          props,
          attrs,
        },
        this.children
      );
    },
  });
}
