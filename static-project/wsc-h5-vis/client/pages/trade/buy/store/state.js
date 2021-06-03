import { getThemeColor } from '@youzan/vue-theme-plugin';
import { get } from 'lodash';

const mainColor = getThemeColor('main');
const design = _global.design || [];
const env = _global.env || {};
const { isShopRest = false } = _global;
const orderCreation = get(_global, 'prepare.orderCreation', {});

const state = {
  design,

  env,

  // 打开页面的时间
  enterTime: new Date().getTime(),

  isShopRest,
  mainColor,
  orderCreation,
};

export default state;
