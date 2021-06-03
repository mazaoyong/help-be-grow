import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import App from './App';
import { initWXSdk } from '@youzan/wxsdk';
import filters from 'common/filters';

Vue.use(Vuex);

// 初始化分享
initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

Vue.filter('numberToCurrency', filters.numberToCurrency);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
