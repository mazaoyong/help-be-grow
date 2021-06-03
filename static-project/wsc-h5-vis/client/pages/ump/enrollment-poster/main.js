import Vue from 'vue';
import App from './index.vue';
// import router from './router';
import { initWXSdk } from '@youzan/wxsdk';

initWXSdk();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
