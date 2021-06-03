/**
 * 引用组件的页面中需要保证 id="shop-footer" 的占位元素存在
 */
import Vue from 'vue';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import App from './App';
import * as api from './api';

const footerEl = document.getElementById('shop-footer');

function initVue(data) {
  // eslint-disable-next-line
  new Vue({
    el: footerEl,
    render: h => h(App, {
      props: {
        footerData: mapKeysToCamelCase(data),
      },
    }),
  });
}
if (footerEl) {
  if (typeof window !== 'undefined' && window._global && window._global.footer_config) {
    initVue(window._global.footer_config);
  } else {
    api.getFooterInfo().then((data) => {
      initVue(data);
    });
  }
}
