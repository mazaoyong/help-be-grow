import StudentList from './index.vue';

StudentList.install = function(Vue) {
  Vue.component(StudentList.name, StudentList);
};

export default StudentList;
