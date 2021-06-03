import VueRouter from 'vue-router';
import Args from 'zan-utils/url/args';
import { setDefaultShareData } from '../utils/share';
import routes from './routes';

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  if (from.fullPath.length > 2) {
    // dcps只记录一次，为下一次打点清空dc_ps
    const dcPs = Args.get('dc_ps', location.href);
    if (dcPs) {
      const newhref = location.href.replace(/dc_ps[^#^&]*/i, '');
      history.replaceState({}, '', newhref);
    }
  }

  // 前端路由兜底，如果因为各种特殊情况（如微信登陆重定向）导致path为空，但是存在p参数，那么尝试拼接一个前端路由path
  // 不要依赖这个兜底，它只能解决少量页面的前端路由参数丢失问题，例如我购买的页面
  if (to.fullPath === '/') {
    if (Args.get('p')) {
      router.replace({ path: `${Args.get('p')}${location.search}` });
      return;
    }
  }
  /* eslint-enable */
  next();
});

// 设置默认分享内容
router.afterEach(setDefaultShareData);

export default router;
