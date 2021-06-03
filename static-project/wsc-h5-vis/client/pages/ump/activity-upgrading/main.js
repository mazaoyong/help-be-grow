import Vue from 'vue';
import App from './index.vue';

import { initWXSdk } from '@youzan/wxsdk';

initWXSdk();

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
