import Notification from './index.vue';

Notification.install = function(Vue) {
  Vue.component(Notification.name, Notification);
};

export default Notification;
