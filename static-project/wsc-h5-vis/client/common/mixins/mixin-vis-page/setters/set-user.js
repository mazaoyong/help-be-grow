import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import commonLogin from 'common/utils/login';

const global = window._global;

export function login(...args) {
  let afterLogin = () => {};
  if (args.length) {
    if (isFunction(args[0])) {
      afterLogin = args[0];
    }
  }

  commonLogin({
    getUser: true,
    authTypeList: ['mobile'],
  })
    .then((userInfo) => {
      const { sessionId: ticket, userId } = userInfo || {};
      afterLogin(ticket, userId, true);
    });
}

export default function setUser(vm) {
  const user = {};

  assign(user, global.visBuyer);
  assign(user, global.user);
  user.isAdmin = global.paidcontent
    ? global.paidcontent.is_admin
    : global.wscvis_edu
      ? global.wscvis_edu.is_admin
      : false;

  // 挂载登录方法
  // mixins 登录方法 已废弃，请使用 common/utils/login
  vm.$user = user;
}
