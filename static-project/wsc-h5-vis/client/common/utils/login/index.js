import userInfoAuthorize from '@youzan/user-info-authorize';
import isFunction from 'lodash/isFunction';
import { ajax } from '@youzan/vis-ui';
import get from 'lodash/get';
import set from 'lodash/set';

const isMiniProgram = get(_global, 'miniprogram.isMiniProgram');

const getUserInfo = () => {
  return ajax({
    data: {},
    url: '/wscvis/getSessionUserInfo.json',
    loading: false,
  });
};

const login = (conf = {}) => {
  const defaultConf = {
    getUser: false,
    forceLogin: true,
    authTypeList: [],
  };
  const queryConfg = Object.assign({}, defaultConf, conf);

  const { forceLogin } = queryConfg;

  return userInfoAuthorize.open({
    forceAuthorize: isMiniProgram ? false : forceLogin,
    authTypeList: queryConfg.authTypeList,
  }).then(result => {
    console.log('userInfoAuthorize.open', result, queryConfg.authTypeList);

    return getUserInfo()
      .then((userInfo) => {
        return Promise.resolve({ user: userInfo, didLogin: result.hasLogin });
      });
  })
    .catch(() => {
      return Promise.reject();
    });
};

export const wrapLogin = (conf = {}, cb) => {
  let afterLogin = () => {};
  if (isFunction(cb)) {
    afterLogin = cb;
  }

  login(Object.assign({}, {
    getUser: true,
    authTypeList: ['mobile'],
  }, conf))
    .then((res) => {
      const { sessionId: ticket, userId } = res.userInfo || {};
      afterLogin(ticket, userId, true);
    });
};

export const checkAndLogin = (cbFn, conf = {}) => {
  if (window._global.need_ajax_login) {
    wrapLogin(conf, (...args) => {
      cbFn(...args);
      window._global.need_ajax_login = false;
    });
  } else {
    let afterLogin = () => {};
    if (isFunction(cbFn)) {
      afterLogin = cbFn;
    }
    afterLogin();
  }
};

// 强制手机登录(包括微信浏览器)
export const forcePhoneLogin = (cbFn, conf = {}) => {
  if (!get(window._global, 'user.has_bind') || !get(window._global, 'authorized.mobile')) {
    wrapLogin(conf, (...args) => {
      cbFn(...args);
      set(window._global, 'user.has_bind', true);
      set(window._global, 'authorized.mobile', true);
    });
  } else {
    let afterLogin = () => {};
    if (isFunction(cbFn)) {
      afterLogin = cbFn;
    }
    afterLogin();
  }
};

export default login;
