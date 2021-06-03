import Vue from 'vue';
import App from './App.vue';
import { initWXSdk } from '@youzan/wxsdk';

initWXSdk({
  shareConfig: {
    notShare: true,
  },
});
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
