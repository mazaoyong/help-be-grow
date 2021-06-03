import Vue from 'vue';
import App from './App.vue';
import { initWXSdk } from '@youzan/wxsdk';
import store from './store';

initWXSdk();

// eslint-disable-next-line no-new
new Vue({
  store,
  el: '#app',
  render: h => h(App),
});
