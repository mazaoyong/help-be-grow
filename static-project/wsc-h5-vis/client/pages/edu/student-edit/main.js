import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './App.vue';

initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

document.title = '编辑学员';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
