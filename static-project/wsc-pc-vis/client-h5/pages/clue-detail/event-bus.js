import Vue from 'vue';

const vue = new Vue({});

const EventBus = {
  install(Vue) {
    Vue.prototype.$bus = vue;
  },
};

Vue.use(EventBus);
