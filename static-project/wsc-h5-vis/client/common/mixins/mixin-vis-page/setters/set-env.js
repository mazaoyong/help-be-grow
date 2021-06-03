import UA from 'zan-utils/browser/ua_browser';

const isMobile = UA.isMobile();
const isPC = !isMobile || navigator.userAgent.indexOf('windowswechat') > -1;

export default function setEnv(vm) {
  vm.$env = {
    isMobile,
    isPC,
  };
}
