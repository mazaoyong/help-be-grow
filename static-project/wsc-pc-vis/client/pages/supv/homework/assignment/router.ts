import { createRoute } from '@youzan/tany-react';
import AssignmentCorrect from './modules/correct';
import WorkbookAssignmentList from './modules/workbook-assignment-list';
import DadaMedia from './dada';
import { CorrectPageViewType, CorrectPageSource } from './modules/correct/types';
import { createRouterWithBreadcrumb } from '../utils';

export const assignmentCorrectRoute = createRoute({
  path: '/correct/:id',
  view: AssignmentCorrect,
  query: {
    source: CorrectPageSource.WORKBOOK,
    viewType: CorrectPageViewType.VIEW,
    reviewerId: 0,
    submitTimeStartAt: '',
    submitTimeEndAt: '',
    orderBy: '',
    title: '',
    userId: 0,
    homeworkId: 0,
    isGoodAssignment: 0,
    publishTimeStartAt: '',
    publishTimeEndAt: '',
    studentName: '',
    status: 0,
  },
  params: {
    id: '0',
  },
  meta: {
    breadcrumb: '批阅作业',
  },
});

export const workbookStudentAssignmentListRoute = createRoute({
  path: '/list',
  query: {
    workbookId: '0',
    studentId: '0',
    studentName: 'TA',
  },
  view: WorkbookAssignmentList,
  meta: {
    breadcrumb: '查看作业',
  },
});

export const dadaMediaRoute = createRoute({
  path: '/dada',
  query: {
    workbookId: '0',
    studentId: '0',
  },
  view: DadaMedia,
});

export const [RouterView, useAssignmentRouterModel] = createRouterWithBreadcrumb({
  base: `/v4/vis/supv/homework/assignment`,
  routes: [
    assignmentCorrectRoute,
    workbookStudentAssignmentListRoute,
    dadaMediaRoute,
  ],
});
