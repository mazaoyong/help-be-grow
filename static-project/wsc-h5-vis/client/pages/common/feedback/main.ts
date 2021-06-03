import Vue from 'vue';

import Track from '@/common/directives/track';

import App from './App.vue';
import trackList from './track-list';

Vue.use(Track, {
  attachTimestamp: true,
  configs: trackList,
  logClient: window.yzlogInstance,
  globalPageType: 'feedback',
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
