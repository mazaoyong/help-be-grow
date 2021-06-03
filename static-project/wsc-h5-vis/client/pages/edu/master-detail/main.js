// 降级为客户端渲染，服务端渲染的时候其实用不到这个文件
import Vue from 'vue';
import App from './index.vue';
import { createStore } from '@/store';

const store = createStore();

// eslint-disable-next-line no-new
new Vue({
  el: '#app', // 降级为客户端渲染的容器
  store,
  render: h => h(App),
});
