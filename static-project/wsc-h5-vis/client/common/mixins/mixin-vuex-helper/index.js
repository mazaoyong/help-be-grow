/**
 * Vuex 辅助 mixin
 * 功能：
 * 1. 将组件对象里的 state 数组自动转换成 Vuex 的 mapState
 * 2. 将组件对象里的 getters 数组自动转换成 Vuex 的 mapGetters
 * 3. 挂载 this.$commit 方法，等价于 this.$store.commit
 * 4. 挂载 this.$dispatch 方法，等价于 this.$store.dispatch
 * 注意：
 * 请在 Vuex store 初始化后再引用本模块，否则会导致 mixin 注册顺序错误
 */
import { mapState, mapGetters } from 'vuex';

export default {
  beforeCreate() {
    const store = this.$store;
    const options = this.$options;
    const state = options.state || [];
    const getters = options.getters || [];

    if (!store) {
      return;
    }

    this.$commit = function(...args) {
      return store.commit.apply(store, args);
    };
    this.$dispatch = function(...args) {
      return store.dispatch.apply(store, args);
    };

    options.computed = options.computed || {};

    Object.assign(
      options.computed,
      mapState(state),
      mapGetters(getters)
    );
  },
};
