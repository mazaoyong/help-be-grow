import Vue from 'vue';
import format from '@youzan/utils/money/format';

// 金钱filter
function formatMoney(value) {
  return '￥' + format(value, true);
}

export const useFormatMoney = () => {
  Vue.filter('formatMoney', formatMoney);
};
