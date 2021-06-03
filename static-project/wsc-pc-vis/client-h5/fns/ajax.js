import { ajax } from '@youzan/vis-ui';
// import { action } from '@youzan/zan-jsbridge';
import UA from '@youzan/utils/browser/ua_browser';
import compareVersions from '@youzan/utils/string/compareVersions';

function ajaxWrapper(options) {
  return ajax(options)
    .then(data => {
      if (data.code === 'VIS_SESSION_EXPIRED') {
        if (UA.isWsc()) {
          // 微商城app环境
          const MAX_WAIT_TIME = 3000;
          const appVersion = UA.getPlatformVersion();
          if (compareVersions(appVersion, '4.66.0') >= 0) {
            return import('@youzan/zan-jsbridge').then(({ action }) => {
              let lock = false;
              const refreshSession = new Promise((resolve, reject) => {
                action.on('refreshEduSessionSuccess', () => {
                  lock = true;
                  resolve(ajax(options));
                });
                action.call('refreshEduSession');
              });
              const timeout = new Promise((resolve, reject) => {
                setTimeout(() => {
                  reject('刷新session失败');
                  if (!lock) {
                    location.href = '/v4/vis/h5/error/session?type=json';
                  }
                }, MAX_WAIT_TIME);
              });

              return Promise.race([refreshSession, timeout]);
            });
          } else {
            // 兼容老版本App
            location.href = '/v4/vis/h5/error/session?type=json';
          }
        } else if (UA.isMiniProgramWebview()) {
          // 商家端小程序环境
          location.href = '/v4/vis/h5/error/session?type=json';
        } else {
          // 其他环境（如PC)
          location.href = '//account.youzan.com/h5/login';
        }
        // location.href并不会直接中断后续js的运行！因此需要reject
        return Promise.reject('登录信息失效');
      }

      return data;
    });
}

export default ajaxWrapper;
