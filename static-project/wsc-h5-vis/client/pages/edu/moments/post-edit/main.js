import Vue from 'vue';
import App from './index.vue';
import store from './store';

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
