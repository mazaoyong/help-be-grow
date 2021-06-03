import Vue from 'vue';
import App from './App.vue';
import { initWXSdk } from '@youzan/wxsdk';

initWXSdk();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
