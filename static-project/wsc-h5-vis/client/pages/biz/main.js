import Vue from 'vue';
import RantaRuntime from '@youzan/ranta-vue';

const configName = _global.ranta_config;

window.Vue = Vue;

const configObj = require(`./${configName}/dev.config.js`);
const { extensions: pageExtensions } = require(`./${configName}/extension-bundle.js`);

new RantaRuntime({
  config: configObj,
}).renderPage({
  page: '/index',
  /** 仅在开发阶段使用本地 bundle */
  builtinBundle: process.env.NODE_ENV === 'development' ? pageExtensions : {},
  el: document.querySelector('#app'),
});
