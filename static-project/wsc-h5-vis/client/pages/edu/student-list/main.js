import Vue from 'vue';
import { Toast } from 'vant';
import { initWXSdk } from '@youzan/wxsdk';
import format from 'zan-utils/money/format';
import App from './App.vue';

initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

// 金钱filter
function formatMoney(value) {
  return format(value, true);
}

Vue.filter('formatMoney', formatMoney);

Vue.use(Toast);

document.title = '选择学员';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
