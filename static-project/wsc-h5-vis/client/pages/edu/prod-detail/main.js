import Vue from 'vue';
import { initWXSdk } from '@youzan/wxsdk';
import App from './App.vue';
import format from 'zan-utils/money/format';
import { importAllSvg } from 'common/utils/helper';

// 导入svg图片
importAllSvg(require.context('assets/images/paid-content', true, /invite_card\.svg$/));
importAllSvg(require.context('assets/images/edu', true, /\.svg$/));

// 初始化微信sdk
initWXSdk();

// 金钱filter
function formatMoney(value) {
  return format(value, true);
}

Vue.filter('formatMoney', formatMoney);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
