/**
 * 页面强制刷新
 * ...
 * config: {
 *    // 支持布尔值
 *    forceRefresh: false
 * }
 * ...
 */
import get from 'lodash/get';

export default {
  beforeRouteEnter(to, from, next) {
    const { config: { forceRefresh = false } } = get(to.matched[0], 'components.default');
    if (!forceRefresh) return next();

    if (window.sessionStorage) {
      const sessionStorage = window.sessionStorage;
      const hasRefreshed = +sessionStorage.getItem('hasRefreshed');
      if (!hasRefreshed) {
        next(false);
        location.reload();
        sessionStorage.setItem('hasRefreshed', 1);
      }
    }

    next();
  },

  beforeRouteLeave(to, from, next) {
    const { $options: { config: { forceRefresh = false } } } = this;
    if (!forceRefresh) return next();

    sessionStorage.setItem('hasRefreshed', 0);
    next();
  },
};
