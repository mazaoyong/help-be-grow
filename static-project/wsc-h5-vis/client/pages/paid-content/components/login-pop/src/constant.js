import UA from 'zan-utils/browser/ua';
// 当前的platform
const currentPlatform = UA.getPlatform();
// app ua列表
const appLoginUaMap = ['youzanars'];

// 当前平台是否在ua map 中
const IS_IN_LOGIN_UA_MAP = appLoginUaMap.indexOf(currentPlatform) > -1;
// 是否展示'绑定'文案
const SHOW_BIND_TEXT = UA.isWeixin() || UA.isQQ();

const ROUTE_TITLE_MAP = {
  init: '请填写您的手机号码',
  login: '该号码注册过，请直接登录',
  findpwd: '找回帐号密码',
  register: '注册有赞帐号',
};

export { IS_IN_LOGIN_UA_MAP, SHOW_BIND_TEXT, ROUTE_TITLE_MAP };
