import Vue from 'vue';
import store from './store';
import router from './router';
import App from './App';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});