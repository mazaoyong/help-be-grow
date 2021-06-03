import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { initWXSdk } from '@youzan/wxsdk';

initWXSdk();
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});
