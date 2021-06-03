import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './App.vue';
import reloadWhenBack from '@/common/utils/reloadWhenBack';

reloadWhenBack();

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
