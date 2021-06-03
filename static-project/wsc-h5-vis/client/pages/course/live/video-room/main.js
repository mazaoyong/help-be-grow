/**
 * 直播页面
 */
import Vue from 'vue';
import App from './App.vue';
import Track from '@/common/directives/track';

import store from './store';
import '../../../common/vuex-helper';
import trackConfig from './track-list';

Vue.use(Track, {
  attachTimestamp: true,
  configs: trackConfig,
  logClient: window.yzlogInstance,
  globalPageType: 'liveVideoRoom',
  leavePagePrefix: 'wscvis',
});
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
