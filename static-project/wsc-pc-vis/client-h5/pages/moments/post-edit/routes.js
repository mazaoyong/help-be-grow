const AddStudent = () => import(/* webpackChunkName: "moments-add-student" */ '../../add-student/AppMoments.vue');
const Main = () => import(/* webpackChunkName: "moments-main" */ './pages/Main.vue');

const routes = [{
  name: 'Student',
  path: '/student',
  component: AddStudent,
}, {
  name: 'Main',
  path: '/',
  component: Main,
}];

export default routes;
