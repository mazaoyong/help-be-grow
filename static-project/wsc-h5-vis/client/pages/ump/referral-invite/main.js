import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import store from './store';
import routes from './routes';
import App from './App';

// 埋点
import Track from '@/common/directives/track';
import trackConfig from './track-list';

initWXSdk({
  shareConfig: {},
});

// vuex挂载
Vue.use(Vuex);

// router挂载
Vue.use(VueRouter);

// 埋点配置
Vue.use(Track, {
  configs: trackConfig,
  logClientSetting: {
    autoSpm: false,
  },
  logClient: window.yzlogInstance,
  globalPageType: 'recommendgift',
  attachTimestamp: true,
});

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/ump/referral-invite',
  routes,
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store: new Vuex.Store(store),
});
