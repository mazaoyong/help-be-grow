import CourseItem from './index.vue';

CourseItem.install = function(Vue) {
  Vue.component(CourseItem.name, CourseItem);
};

export default CourseItem;
