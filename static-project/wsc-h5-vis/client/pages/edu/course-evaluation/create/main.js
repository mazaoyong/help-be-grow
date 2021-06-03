import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './App';

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
