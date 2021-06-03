import Vue from 'vue';
import Delegate from 'dom-delegate';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import UA from 'zan-utils/browser/ua_browser';
import VueFullGuide from './main';

let instance;
const global = window._global || {};
const mpData = global.mp_data;
const defaultOptions = {
  visible: true,
  mpData: mapKeysToCamelCase(mpData),
  mpWeixin: global.mp_account.weixin_account,
  mpId: global.mp_account.id,
};

const parseOptions = viewType => {
  if (typeof viewType === 'object') return viewType;
  // pc端特殊处理
  if ((viewType === 'follow' || viewType === 'goodsFollow') && !global.platform_info.is_mobile) {
    viewType = 'pc';
  }
  return { viewType };
};

const createInstance = (options) => {
  instance = new (Vue.extend(VueFullGuide))({
    el: document.createElement('div'),
    ...options,
  });

  instance.$on('input', value => {
    instance.value = value;
  });

  document.body.appendChild(instance.$el);

  return instance;
};

const FullGuide = (options = {}) => {
  if (!instance) {
    instance = createInstance();
  }

  options = {
    ...defaultOptions,
    ...parseOptions(options),
  };

  const { viewType } = options;

  // 特殊逻辑处理
  if (viewType === 'share') {
    if (window.YouzanJSBridge) {
      return window.YouzanJSBridge.doShare();
    }
  } else if ((viewType === 'follow' || viewType === 'goodsFollow') && !mpData) {
    return false;
  } else if (viewType === 'browser' && !UA.isWeixin()) {
    return false;
  }

  Object.assign(instance, options);
};

Vue.prototype.$fullGuide = FullGuide;

// 默认全局事件绑定, 维持原样
function getSelectHandler(selector) {
  const matchedTrigger = selector.match(/\.js-open-(follow|browser|fav|share)/)[1];

  return (e) => {
    e.preventDefault();
    const el = e.target;
    const matchedStop = el.className.match(/(?:wxid|js-quick-subscribe)/);
    if (matchedStop) {
      e.stopPropagation();
    }
    FullGuide(matchedTrigger);
  };
}
function initBind() {
  const bodyDelegate = Delegate(document.body);
  const matchSelector = [
    '.js-open-follow',
    '.js-open-browser',
    '.js-open-fav',
    '.js-open-share',
  ];
  matchSelector.forEach((selector) => {
    bodyDelegate.on('click', selector, getSelectHandler(selector));
  });
}

initBind();

export default FullGuide;
