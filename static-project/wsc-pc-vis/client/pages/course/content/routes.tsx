// @ts-check
import { createRouter, visPush } from 'fns/router';
import React from 'react';
import { TempAlertInfo } from '@youzan/ebiz-components';

import SessionStorage from '@youzan/utils/browser/session_storage';

import ListPage from './list';
import EditPage from './EditPage';
import StudyRecord from '../common/study-record';
import StudyDetail from '../common/study-detail';

const { isYZEdu } = window._global;
const { IOSBuyAlert } = TempAlertInfo;
const types = {
  text: '图文',
  audio: '音频',
  video: '视频',
};

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list',
    component: (props) => <>
      <IOSBuyAlert />
      <ListPage {...props}/>
    </>,
    breadcrumb: '',
    onEnter() {
      // 在信息采集组件中设置了sessionStorage，为了再次新建还是用storage的值，就在路由中删除该值
      SessionStorage.removeItem('tempInfoCollect');
      if (!isYZEdu) {
        visPush(`tabs/content`);
      }
    },
  },
  {
    path: 'edit/:type',
    component: EditPage,
    breadcrumb: nextState => {
      const type = nextState.params.type;
      return `编辑${types[type] || '内容'}`;
    },
  },
  {
    path: 'add/:type',
    component: EditPage,
    breadcrumb: nextState => {
      const type = nextState.params.type;
      return `新建${types[type] || '内容'}`;
    },
  },
  {
    path: 'record',
    component: StudyRecord,
    breadcrumb: '学习记录',
  },
  {
    path: 'detail',
    component: StudyDetail,
    breadcrumb: '学员详情',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
