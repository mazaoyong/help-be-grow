import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './index.vue';
import router from './router';

initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
