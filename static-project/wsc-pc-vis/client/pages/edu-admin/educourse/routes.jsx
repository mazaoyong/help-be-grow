import React from 'react';
import { createRouter } from 'fns/router';
import TabWrapper from '@ability-center/edu-course/tab-wrapper';
// import EduCourse from './ListPage';
import EditEduCourse from './EditPage';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list',
    component: () => <TabWrapper id='educourse' />,
    breadcrumb: '',
    onEnter() {
    },
  },
  {
    path: 'add',
    component: EditEduCourse,
    breadcrumb: '新建课程',
    onEnter() {},
  },
  {
    path: 'edit/:id',
    component: EditEduCourse,
    breadcrumb: '编辑课程',

  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
