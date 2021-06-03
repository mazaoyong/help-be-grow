/* !
 * 支持多个Vue组件的拼接展示
 * 这也是与`./vue-preview`中unify的本质区别
 * @author: yugang@youzan.com
 */

import Vue from 'vue';
import { Lazyload } from 'vant';
import isFunction from 'lodash/isFunction';

Vue.use(Lazyload);

/**
 * 统一预览区 Vue 组件
 * @param componentsObject {Object} : 需要拼接的Vue组件 map
 * @param mapOptionsToProps {function} : A function to translate options into props
 */
export default function unifyComponents(componentsObject, mapOptionsToProps, mapOptionsToAttrs) {
  /**
   * 返回VNODE List
   * @param h {Function} : Vue原生的方法
   * @param props {Object} : 所有Vue组件需要的对象属性 对象
   */
  const getList = (h, props) => {
    const _result = [];
    const _keys = Object.keys(componentsObject);
    for (let i = 0; i < _keys.length; i++) {
      const index = _keys[i];
      const comp = componentsObject[index];
      const compProps = props[index];

      _result.push(h(comp, { props: compProps }));
    }
    return _result;
  };

  // 返回
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

      return h('div', {}, getList(h, props, attrs));
    },
  });
}
