import Vue from 'vue';
import VueRouter from 'vue-router';
import { Lazyload, Dialog } from 'vant';
import { initWXSdk } from '@youzan/wxsdk';
import routes from './routes';
import App from './App';
import commonFilters from 'common/filters';
import keys from 'lodash/keys';
import { importAllSvg } from 'common/utils/helper';
import * as SafeLink from '@youzan/safe-link';

// 导入svg图片
importAllSvg(require.context('assets/images/paid-content', true, /share_book\.svg$/));

// 批量注册filters
keys(commonFilters).forEach((key) => {
  Vue.filter(key, commonFilters[key]);
});

initWXSdk();

// 全局注册 dialog 组件
Vue.use(Dialog);

// 初始化路由
Vue.use(VueRouter);
Vue.use(Lazyload);
const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/exam/',
  routes: routes,
});

// 添加路由hook动态修改页面title
// 约定如果router.meta.needFetch 表示需要根据请求结果来设置， 则跳过
// 如果 router.meta.hideCopyright 表示需要隐藏底部
router.beforeEach((to, from, next) => {
  // 如果 meta.pass 标记为 true，表示需要刷新页面
  if (to.meta.pass && from.matched.length) {
    const {
      origin,
      pathname,
      search,
    } = window.location;
    const query = new URLSearchParams(search);
    Object.keys(to.query).forEach(key => {
      query.set(key, to.query[key]);
    });
    query.delete('p');
    query.set('page', to.name.toLowerCase());
    const queryStr = `?${query.toString()}`;
    SafeLink.redirect({
      url: `${origin}${pathname}${queryStr}`,
      kdtId: window._global.kdt_id,
    });
    return;
  }

  if (to.meta.hideCopyright) {
    const $copyright = document.querySelector('.footer');
    if ($copyright) {
      $copyright.style.display = 'none';
    }
  }
  if (!to.meta.needFetch) {
    document.title = to.meta.title;
  }

  /* eslint-enable */
  next();
});
// 动态更新分享内容
router.afterEach(route => {

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  mounted: () => {
  },
  render: h => h(App),
});
