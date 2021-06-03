import React from 'react';
import { createRouter } from 'fns/router';
import EditPage from './EditPage';
import TabWrapper from '@ability-center/edu-course/tab-wrapper';
import SchoolBranchPage from './SchoolPage';
import { isInStoreCondition, arrayColumnWrapper } from 'fns/chain';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'course-manage/list',
    component: () => <TabWrapper id='course' />,
    breadcrumb: '',
    onEnter() {},
  },
  {
    path: 'course-manage/add',
    component: EditPage,
    breadcrumb: '发布线下课',
    onEnter() {},
  },
  {
    path: 'course-manage/add/:alias',
    component: EditPage,
    breadcrumb: '复制线下课',
    onEnter() {},
  },
  {
    path: 'course-manage/edit/:alias',
    component: EditPage,
    breadcrumb: '编辑线下课',

  },
  {
    path: 'course-manage/schools/:alias',
    component: SchoolBranchPage,
    breadcrumb: '配置可售校区',
    chainState: isInStoreCondition({
      supportEduHqStore: true,
    }),
  },
  {
    path: '*',
    redirect: 'course-manage/list',
  },
];

export default createRouter(arrayColumnWrapper(routes));
