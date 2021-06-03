import Vue from 'vue';
import VueRouter from 'vue-router';
import keys from 'lodash/keys';
import sharedStore from '@youzan/shared-store';
import { Dialog, ImagePreview } from 'vant';
import { initWXSdk, setShareData } from '@youzan/wxsdk';
// import imIcon from '@youzan/im-icon';
import { importAllSvg } from 'common/utils/helper';
import commonFilters from 'common/filters/index';
import { setPageConfig } from 'common/mixins/mixin-vis-page';
import { setShareCallBack } from './utils/share';
import { getDefaultLog } from './utils/log';
import { RECORD_JSSDK_APILIST } from './constants';
import App from './App';
import router from './router';

// 监听设置分享的事件，由这里的 wxsdk 进行设置
// wsc-h5-components 会触发这个事件
sharedStore.on('wxsdk:setShareData', (data = {}) => {
  // 处理时序问题
  const globalData = window._global || {};
  globalData.share = globalData.share
    ? Object.assign(globalData.share, data)
    : data;
  setShareData(globalData.share);
});

// 初始化分享
initWXSdk({
  jsApiList: RECORD_JSSDK_APILIST,
});
// 导入svg图片
importAllSvg(require.context('assets/images/paid-content', true, /\.svg$/));
// 批量注册filters
keys(commonFilters).forEach((key) => {
  Vue.filter(key, commonFilters[key]);
});
// 设置分享回调
setShareCallBack();
// 全局注册 dialog 组件
Vue.use(Dialog);
// 图片预览组件
Vue.use(ImagePreview);
// 初始化路由
Vue.use(VueRouter);
// 设置默认 config 选项
setPageConfig((pageName) => {
  return {
    log: getDefaultLog(pageName),
  };
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data() {
    return {
      showPCMode: false,
    };
  },
  mounted: () => {
    // imIcon.init('.js-im-icon', {
    //   fromSource: {
    //     source: 'goods',
    //     site_id: window._global.kdtId,
    //   },
    // });
  },
  render: h => h(App),
});
