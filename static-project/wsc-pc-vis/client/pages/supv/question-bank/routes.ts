import { createRouter, IVisRoutes } from 'fns/router';
import QuestionBankList from './list';
import QuestionBankEdit from './edit';
import ClassifyManage from './classify-manage';
import QuestionBankImport from './import';

const modifyRouteHooks = {
  onEnter() {
    const appInnerEle = document.querySelector('.app-inner');
    if (appInnerEle) {
      appInnerEle.classList.add('remove-bg');
    }
  },
  onLeave() {
    const appInnerEle = document.querySelector('.app-inner');
    if (appInnerEle) {
      appInnerEle.classList.remove('remove-bg');
    }
  },
};

const routes: IVisRoutes[] = [
  {
    path: 'list',
    component: QuestionBankList,
  },
  {
    path: 'edit',
    breadcrumb: '编辑题目',
    component: QuestionBankEdit,
    ...modifyRouteHooks,
  },
  {
    path: 'import',
    breadcrumb: '批量导入',
    component: QuestionBankImport,
  },
  {
    path: 'import/list',
    breadcrumb: '批量导入',
    component: QuestionBankImport,
  },
  {
    path: 'duplicate',
    breadcrumb: '复制题目',
    component: QuestionBankEdit,
    ...modifyRouteHooks,
  },
  {
    path: 'create',
    breadcrumb: '新建题目',
    component: QuestionBankEdit,
    ...modifyRouteHooks,
  },
  {
    path: 'classify-manage',
    component: ClassifyManage,
    breadcrumb: '分类管理',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
