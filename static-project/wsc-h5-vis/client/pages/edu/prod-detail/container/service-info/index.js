import ServerInfo from './index.vue';

ServerInfo.install = function(Vue) {
  Vue.component(ServerInfo.name, ServerInfo);
};

export default ServerInfo;
