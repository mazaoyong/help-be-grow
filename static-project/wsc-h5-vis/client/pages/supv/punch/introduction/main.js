import Vue from 'vue';
import App from './App';
import { initWXSdk } from '@youzan/wxsdk';

// 初始化分享
initWXSdk();

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
