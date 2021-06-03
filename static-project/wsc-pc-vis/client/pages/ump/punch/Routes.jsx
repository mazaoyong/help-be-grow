import React from 'react';
// import { Router, Route, IndexRedirect, Redirect, hashHistory } from 'react-router';
import { createRouter } from 'fns/router';
import './style/index.scss';

import { TempAlertInfo } from '@youzan/ebiz-components';
import ListPage from './ListPage';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import TaskEditPage from './TaskEditPage';
import PromotePage from './PromotePage';
import DiaryPage from './DiaryPage';
import StatisticsPage from './StatisticsPage';

const { PunchAlert } = TempAlertInfo;
const Wrapper = props => {
  return <div className="punch-wrapper">{props.children}</div>;
};

const routes = [
  {
    path: '/',
    component: Wrapper,
    breadcrumb: '',
    children: [
      {
        path: 'list',
        component: (props) => <><PunchAlert /><ListPage /></>,
        breadcrumb: '',
      },
      {
        path: 'add',
        breadcrumb: '新建打卡',
        component: EditPage,
      },
      {
        path: 'edit/:alias',
        breadcrumb: '编辑打卡',
        component: EditPage,
      },
      {
        path: 'detail/:alias',
        breadcrumb: '打卡详情',
        component: DetailPage,
      },
      {
        path: 'task/:id',
        breadcrumb: '设置任务',
        component: TaskEditPage,
      },
      {
        path: 'promote/:alias',
        breadcrumb: '推广配置',
        component: PromotePage,
      },
      {
        path: 'diary/:alias',
        breadcrumb: '打卡进度',
        component: DiaryPage,
      },
      {
        path: 'statistics/:alias',
        breadcrumb: '数据',
        component: StatisticsPage,
      },
    ],
  },
  {
    path: '*',
    redirect: '/list',
  },
];

export default createRouter(routes);
