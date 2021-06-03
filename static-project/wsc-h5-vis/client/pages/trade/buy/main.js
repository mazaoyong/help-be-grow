/**
 * 下单/支付页入口文件
 */
import Vue from 'vue';
import { Toast, Dialog } from 'vant';
import { get } from 'lodash';
import App from './App';
import { router } from './router';
import store from './store';
import initBridge from './saas';
import LogPointVue from '@youzan/log-point-vue';
import Track from '@/common/directives/track';
import 'common/global/common-run/init-global-bridge';

import { useVuexHelper } from './utils/use-vuex-helper';
import { useFormatMoney } from './utils/use-format-money';

import trackConfig from './track-list';

useVuexHelper();
useFormatMoney();

Vue.use(Toast);
Vue.use(Dialog);
Vue.use(LogPointVue, {
  old: true,
});
Vue.use(Track, {
  attachTimestamp: true,
  configs: trackConfig,
  logClient: window.yzlogInstance,
  globalPageType: get(_global, 'spm.logType', 'paidStatus'),
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  router,
  created() {
    initBridge(this.$store, this.$router, this);
  },
  render: h => h(App),
});
