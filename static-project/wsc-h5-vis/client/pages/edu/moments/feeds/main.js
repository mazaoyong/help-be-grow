import Vue from 'vue';
import App from './index.vue';
import store from './store';
import { Notify, ImagePreview } from 'vant';

Vue.use(Notify);
// Vue.use(Lazyload);
Vue.use(ImagePreview);

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
