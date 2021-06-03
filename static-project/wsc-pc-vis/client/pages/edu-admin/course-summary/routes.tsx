import React from 'react';
import { format, subDays } from 'date-fns';
import { IVisRoutes, createRouter } from 'fns/router';

import { TabWrapper } from './components/tab-wrapper';
import { StudentSummary } from './blocks/dimensions/student';
import { ApplyListSummary } from './blocks/dimensions/apply-list';
import { CourseSummaryDetail } from './blocks/details';

const latestUpdateTime = format(subDays(Date.now(), 1), '数据更新至YYYY年MM月DD日');
const withTabWrapper = (Child: React.ComponentType<any>) => (routeProps: any) => (
  <div className="course-summary">
    <section className="header">
      <div className="description">{latestUpdateTime}</div>
    </section>
    <TabWrapper {...routeProps}>
      <Child {...routeProps} />
    </TabWrapper>
  </div>
);

const routes: IVisRoutes[] = [
  {
    path: 'student',
    component: withTabWrapper(StudentSummary),
    title: '课时汇总-按学员',
    breadcrumb: '按学员',
  },
  {
    path: 'apply-list',
    component: withTabWrapper(ApplyListSummary),
    title: '课时汇总-按报读课程',
    breadcrumb: '按报读课程',
  },
  {
    path: 'detail/:overviewType/:targetId',
    component: CourseSummaryDetail,
    breadcrumb: '明细',
  },
  {
    path: '*',
    redirect: 'student',
  },
];

export default createRouter(routes);
