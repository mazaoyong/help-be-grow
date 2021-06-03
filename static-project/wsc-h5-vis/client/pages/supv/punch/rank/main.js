import Vue from 'vue';
import App from './App';
import { initWXSdk } from '@youzan/wxsdk';
import store from './store';

// 初始化分享
initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  store,
});
