import Vue from 'vue';
import Router from 'vue-router';
import Args from 'zan-utils/url/args';

Vue.use(Router);

const clueId = Number(Args.get('clueId')) || 0;

const cluePath = '/v4/vis/h5/edu/clue';
const ClueDetail = () => import(/* webpackChunkName: "view-clue-detail" */ './views/clue-detail');
const SelectOrder = () => import(/* webpackChunkName: "select-order" */ './views/select-order');
const EditTag = () => import(/* webpackChunkName: "view-edit-tag" */ './views/edit-tag');
const SignupDetail = () => import(/* webpackChunkName: "view-clue-tag" */ './views/signup-detail');
const RecordDetail = () => import(/* webpackChunkName: "view-edit-tag" */ './views/record-detail');
const StudentInfo = () =>
  import(/* webpackChunkName: "view-student-info" */ './views/student-info');
const ClueTag = () => import(/* webpackChunkName: "view-clue-tag" */ './views/clue-tag');
const UpdateDynamic = () =>
  import(/* webpackChunkName: "view-update-dynamic" */ './views/update-dynamic');

const routes = [
  {
    path: `${cluePath}/clue-detail`,
    name: 'clue-detail',
    component: ClueDetail,
  },
  {
    path: `${cluePath}/clue-detail/select-order`,
    name: 'select-order',
    component: SelectOrder,
  },
  {
    path: `${cluePath}/edit-tag`,
    name: 'edit-tag',
    component: EditTag,
  },
  {
    path: `${cluePath}/signup-detail`,
    name: 'signup-detail',
    component: SignupDetail,
  },
  {
    path: `${cluePath}/record-detail`,
    name: 'record-detail',
    component: RecordDetail,
  },
  {
    path: `${cluePath}/student-info`,
    name: 'student-info',
    component: StudentInfo,
  },
  {
    path: `${cluePath}/clue-tag`,
    name: 'clue-tag',
    component: ClueTag,
  },
  {
    path: `${cluePath}/update-dynamic`,
    name: 'update-dynamic',
    component: UpdateDynamic,
  },
];

let router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'clue-detail' && from.name !== 'clue-detail') {
    next({ path: `${cluePath}/clue-detail`, query: { clueId } });
  } else {
    next();
  }
});

export default router;
