import { createRoute } from '@youzan/tany-react';
import { createRouterWithBreadcrumb } from '../utils';
import HomeworkEdit from './modules/edit';
import HomeworkStudentAssignmentList from './modules/student-assignment-list';

export const homeworkEditRoute = createRoute({
  path: '/:id/edit',
  view: HomeworkEdit,
  meta: {
    breadcrumb: '编辑作业',
  },
});

export const homeworkCreateRoute = createRoute({
  path: '/add',
  view: HomeworkEdit,
  query: {
    workbookId: '0',
  },
  meta: {
    breadcrumb: '布置作业',
  },
});

export const homeworkStudentAssignmentsRoute = createRoute({
  path: '/:id/assignments',
  query: {
    workbookId: '0',
  },
  view: HomeworkStudentAssignmentList,
  meta: {
    breadcrumb: '学员作业',
  },
});

export const [RouterView, useHomeworkRouterModel] = createRouterWithBreadcrumb({
  base: `/v4/vis/supv/homework/work`,
  routes: [
    homeworkCreateRoute,
    homeworkEditRoute,
    homeworkStudentAssignmentsRoute,
  ],
});
