import NoCourse from './index.vue';

NoCourse.install = function(Vue) {
  Vue.component(NoCourse.name, NoCourse);
};

export default NoCourse;
