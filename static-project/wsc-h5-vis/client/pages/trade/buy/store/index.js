import Vue from 'vue';
import Vuex from 'vuex';
import options from './options';
import { versionWrapper } from '@/vis-shared/configs/version/fns';

Vue.use(Vuex);

const store = new Vuex.Store(versionWrapper('appointEnter', options));

// 先进行页面级别的校验
// 校验不成功就返回
// 积分商城时先校验积分足额（积分商城判断感觉不科学）
if (store.getters.isPointsExchange) {
  store.dispatch('CHECK_POINTS_IS_ENOUGH');
}
// 异步补全商品信息
if (store.getters.isLive) {
  store.dispatch('FETCH_LIVE_EXTRA_DATA');
}

if (store.getters.isContent || store.getters.isPackageBuy) {
  store.dispatch('FETCH_GOODS_EXTRA_DATA_LIST');
}

// 异步处理非订单数据, 用来处理跨模块/依赖store.getters的数据
// 初始化优惠套餐数据
if (store.getters.isPackageBuy) {
  store.dispatch('INIT_PACKAGE_BUY_DATA', _global.packageBuy);
}

store.dispatch('INIT_MEET_REDUCE_DATA', _global.meetReduce);

// 下单页enterpage打点
store.dispatch('LOG_ENTERPAGE');

// youzanyun定制检查
store.dispatch('CHECK_YZYUN_DESIGN_STATUS');

export default store;
