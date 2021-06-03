// import React from 'react';
import type { FilterConfigType } from '@youzan/ebiz-components/es/types/easy-list';
import { StudentFilterSelector, selectAllStudent } from '@ability-center/student';
import { CourseFilterSelector, selectAllCourse } from '@ability-center/course';
import { COURSE_STATUS_LIST } from 'pages/edu-admin/course-summary/domain/constants';
import { YESTERDAY } from 'pages/edu-admin/course-summary/utils/only-before-yesterday';

interface IGetFilterConfigParams {}
export const getFilterConfig = (_params: IGetFilterConfigParams): FilterConfigType => {
  return [
    [
      {
        name: 'userId',
        label: '学员：',
        type: 'Custom',
        defaultValue: 'all',
        renderField: StudentFilterSelector,
        inheritProps: {
          targetKey: 'userId',
          defaultOptions: [selectAllStudent],
        },
      },
      {
        name: 'eduCourseId',
        label: '课程名称：',
        type: 'Custom',
        defaultValue: 'all',
        renderField: CourseFilterSelector,
        inheritProps: {
          defaultOptions: [selectAllCourse],
        },
      },
      {
        name: 'courseStatus',
        label: '课程状态：',
        type: 'Select',
        defaultValue: 'all',
        options: [
          {
            value: 'all',
            text: '全部',
          },
          ...COURSE_STATUS_LIST,
        ],
      },
    ],
    [
      {
        name: 'lessonTime',
        label: '变更时间：',
        type: 'DateRangePicker',
        inheritProps: {
          max: YESTERDAY
        }
      },
    ],
  ];
};
