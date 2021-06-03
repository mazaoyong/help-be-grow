import React from 'react';
import { loadable } from '@youzan/arthur-scheduler-react';
import type { ITab } from 'zent';

export const SUMMARY_LIST_TAB_CONFIG: ITab<string>[] = [
  { title: '按学员', key: 'student' },
  { title: '按报读课程', key: 'apply-list' },
];
export const COURSE_STATUS_LIST: Array<{ value: string; text: string }> = [
  {
    value: '1',
    text: '已学完',
  },
  {
    value: '2',
    text: '未开始',
  },
  {
    value: '3',
    text: '进行中',
  },
  {
    value: '4',
    text: '已退课',
  },
];
interface ISummaryDetailTab extends ITab<string> {
  Comp: React.FC<any>;
}
const CourseRecords = loadable(() =>
  import(/* webpackChunkName: "course-records" */ '../../blocks/details/records'),
);
const ManualConsumeRecords = loadable(() =>
  import(/* webpackChunkName: "manual-consume-records" */ '../../blocks/details/manual-consume'),
);
export const SUMMARY_DETAIL_TAB_CONFIG: ISummaryDetailTab[] = [
  { title: '上课记录', key: 'records', Comp: CourseRecords },
  { title: '手动扣减', key: 'manual-consume', Comp: ManualConsumeRecords },
];
