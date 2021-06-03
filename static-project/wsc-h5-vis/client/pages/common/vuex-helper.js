/**
 * Vuex 辅助 mixin
 * 功能：
 * 1. 将组件对象里的 state 数组自动转换成 子 store 中的 state（组件对象需要有 storeName 属性）
 * 2. 将组件对象里的 getters 数组自动转换成 子 store 中的 getters（组件对象需要有 storeName 属性）
 * 3. 挂载 this.$dispatch('xxx', ...args) 方法，等价于 this.$store.dispatch(`${storeName}/xxx`, ...args)（组件对象需要有 storeName 属性）
 * 4. 挂载 this.$commit('xxx', ...args) 方法，等价于 this.$store.commit(`${storeName}/xxx`, ...args)（组件对象需要有 storeName 属性）
 * 5. 将组件对象里的 rootState 数组自动转换成 根 store 中的 state
 * 6. 将组件对象里的 rootGetters 数组动转换成 根 store 中的 getters
 * 7. 挂载 this.$rootDispatch('xxx', ...args) 方法，等价于 this.$store.dispatch('xxx', ...args)
 * 8. 挂载 this.$rootCommit('xxx', ...args) 方法，等价于 this.$store.commit('xxx', ...args)
 * 注意：
 * 请在 Vuex store 初始化后再引用本模块，否则会导致 mixin 注册顺序错误
 */
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';

Vue.mixin({
  beforeCreate() {
    const store = this.$store;
    const options = this.$options;
    const storeName = options.storeName || '';
    const state = options.state || [];
    const getters = options.getters || [];
    const rootState = options.rootState || [];
    const rootGetters = options.rootGetters || [];

    if (!store) {
      return;
    }

    if (!storeName && (state.length || getters.length)) {
      throw new Error("Must have option: 'storeName' to use state or getters!");
    }

    this.$dispatch = function(name, ...args) {
      return store.dispatch(`${storeName}/${name}`, ...args);
    };
    this.$commit = function(name, ...args) {
      return store.commit(`${storeName}/${name}`, ...args);
    };
    this.$rootDispatch = function(...args) {
      return store.dispatch(...args);
    };
    this.$rootCommit = function(...args) {
      return store.commit(...args);
    };

    options.computed = options.computed || {};

    Object.assign(
      options.computed,
      mapState(storeName, state),
      mapGetters(storeName, getters),
      mapState(rootState),
      mapGetters(rootGetters)
    );
  },
});
