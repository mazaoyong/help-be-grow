/**
 * @file
 * vue-router 路由配置
 * 除 index 外，其他视图均为异步组件
 * 目前就一张页面，所以部分代码注释着
 */
import Vue from 'vue';
import Router from 'vue-router';
import { Toast } from 'vant';
import IndexView from './view/index';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    name: 'index',
    path: '/',
    component: IndexView,
    meta: {
      title: '确认订单',
    },
  },
];

// 初始化路由并定义滚动行为
const router = new Router({
  base: '/pay/wscvis_buy',
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});

// 页面切换时设置标题
// router.beforeEach((to, _from, next) => {
//   const title = to.meta && to.meta.title;
//   if (title) {
//     document.title = title;
//   }
//   next();
// });

router.onError((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  Toast('网络错误，请稍候再试');
});

// 重定向至首页
// router.replace('/');

export { router };
