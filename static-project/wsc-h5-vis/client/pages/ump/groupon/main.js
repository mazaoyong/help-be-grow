import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './index.vue';
import store from './store';

initWXSdk();

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
