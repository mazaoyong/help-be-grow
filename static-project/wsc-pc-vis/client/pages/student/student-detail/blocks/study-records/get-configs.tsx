import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import format from 'date-fns/format';
import { isInStoreCondition } from 'fns/chain';
import { number } from '@youzan/utils';
import { ICombinedFilterConf, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';

import { showLessonName } from '../class-schedule/get-configs';

const { DatePickerTypes } = EasyList;

const getStudyRecordConfig = (initialValue: Partial<IFilterFields> = {}): ICombinedFilterConf[] => [
  {
    name: 'rangeTime',
    label: '日期：',
    defaultValue: initialValue.rangeTime,
    type: DatePickerTypes.DateRangePicker,
  },
  {
    name: 'title',
    label: '课程：',
    type: 'Input',
    defaultValue: initialValue.title,
    inheritProps: {
      width: '200px',
      placeholder: '请输入课节名称或课程名称',
    },
  },
];

const COURSE_STATUS = ['待签到', '已签到', '请假', '未到'];
const COURSE_CLASS = ['notSign', 'in', 'leave', 'notIn'];
const weekReflect = ['一', '二', '三', '四', '五', '六', '日'];

function getStudyRecordColumns(): IEasyGridColumn<IRowDataItem & any>[] {
  return [
    {
      title: '日期',
      width: 180,
      fixed: true,
      nowrap: true,
      bodyRender: ({ startTime, week }) => {
        if (startTime) {
          return `${format(startTime, 'YYYY-MM-DD')} 周${weekReflect[week - 1]}`;
        }
        return '-';
      },
    },
    {
      title: '时间',
      width: 200,
      nowrap: true,
      bodyRender: ({ startTime, endTime }) => {
        if (!startTime) return '-';
        return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
      },
    },
    {
      title: '课程',
      width: 220,
      nowrap: true,
      bodyRender: item => <div className="ellipsis">{showLessonName(item)}</div>,
    },
    {
      title: '课程类型',
      width: 100,
      nowrap: true,
      bodyRender: ({ courseType }) => (courseType ? '正式课' : '体验课'),
    },
    {
      title: '上课地点',
      width: 100,
      nowrap: true,
      visible: isInStoreCondition({
        supportBranchStore: true,
        supportSingleStore: true,
      }),
      bodyRender: ({ courseAttendDTO = {} }) => (courseAttendDTO ? courseAttendDTO.address : '-'),
    },
    {
      title: '上课校区',
      width: 200,
      nowrap: true,
      visible: isInStoreCondition({
        supportHqStore: true,
      }),
      bodyRender: ({ campus = {} }) => campus.name || '-',
    },
    {
      title: '教室',
      width: 200,
      nowrap: true,
      bodyRender: ({ classroomName }) => classroomName || '-',
    },
    {
      title: '老师',
      width: 100,
      nowrap: true,
      bodyRender: ({ teacherName }) => teacherName || '-',
    },
    {
      title: '消耗课时',
      width: 150,
      nowrap: true,
      bodyRender: ({ consumeCourseTime }) => number.accDiv(consumeCourseTime, 100) || '-',
    },
    {
      title: '签到状态',
      width: 100,
      nowrap: true,
      bodyRender: ({ lessonState }) => {
        const description = COURSE_STATUS[lessonState];
        const statusCls = COURSE_CLASS[lessonState];

        return <div className={`withDot course-${statusCls}`}>{description}</div>;
      },
    },
  ];
}

export default getStudyRecordConfig;
export { getStudyRecordColumns };

type DateType = Date | string | number;
export interface IFilterFields extends Record<string, any> {
  title: string;
  rangeTime: [DateType, DateType];
}

interface IRowDataItem {}
