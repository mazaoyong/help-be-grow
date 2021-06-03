import Nav from './index.vue';

Nav.install = function(Vue) {
  Vue.component(Nav.name, Nav);
};

export default Nav;
