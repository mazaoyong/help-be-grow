import Vue from 'vue';
import App from './App.vue';
import { initWXSdk } from '@youzan/wxsdk';
import store from './store';

initWXSdk();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
});
