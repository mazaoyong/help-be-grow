import Vue from 'vue';
import VueRouter from 'vue-router';
import { Lazyload } from 'vant';
import { get } from 'lodash';
import LogPointVue from '@youzan/log-point-vue';
import { importAllSvg } from 'common/utils/helper';
import Track from '@/common/directives/track';

import store, { getDefaultLogParams } from './store';
import trackConfig from './track-list';
import './common/vuex-helper';
import App from './App';

// TODO 需要将 svg 全部导入 iconfont ，通过 vis-ui 中的 icon 组件使用
importAllSvg(require.context('assets/images/paid-content', true, /\.svg$/));

document.title = store.state.goodsData.title;

Vue.use(VueRouter);
Vue.use(Lazyload);
Vue.use(LogPointVue, {
  old: true,
});
Vue.use(Track, {
  attachTimestamp: true,
  configs: trackConfig,
  logClient: window.yzlogInstance,
  globalPageType: get(_global, 'spm.logType', 'pct'),
  leavePagePrefix: 'wscvis',
});

LogPointVue.setOption({
  defaultParams: getDefaultLogParams(),
});

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/course/detail',
  routes: [{
    path: '/:alias',
    component: App,
  }],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
