import Vue from 'vue';
import store from './store';
import App from './App';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  store,
});
