import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import { initWXSdk } from '@youzan/wxsdk';
import storeConfig from './store';

// 初始化分享
initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

Vue.use(Vuex);

const store = new Vuex.Store(storeConfig);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  store,
});
