import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import store from './store';
import router from './router';
import App from './App.vue';
// 埋点
import Track, { ITrackSetting } from '@/common/directives/track';
import trackConfig from './track-list';

initWXSdk();
Vue.use(Track, {
  configs: trackConfig,
  logClient: window.yzlogInstance,
  globalPageType: 'tuition',
  attachTimestamp: true,
} as ITrackSetting);

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
