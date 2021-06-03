
import React, { ReactElement } from 'react';
import { ILessonData, IStatistics, IScheduleFilter } from '../interface';
import { getCurrentMonth, getLastMonth, getLastWeek, getCurrentWeek } from '../time-utils';
import { isInStoreCondition } from 'fns/chain';
import { endOfYesterday } from 'date-fns';

interface IRecordData {
  teacherStatistics: Partial<IStatistics>;
  lesson: Partial<ILessonData>;
}

// interface IRecordEvent {
//   onCourseChange: (e: Event) => void;
//   onDateRangeChange: (e: Event) => void;
// }

export function recordColumns() : any[] {
  return [
    {
      title: '上课时间',
      width: 100,
      bodyRender({ lesson = {} }: IRecordData): string {
        return lesson.lessonTime || '-';
      },
    },
    {
      title: '班级',
      width: '100px',
      bodyRender({ lesson = {} }: IRecordData): string {
        return lesson.className || '-';
      },
    },
    {
      title: '课程',
      bodyRender({ lesson = {} }: IRecordData): string {
        return lesson.eduCourseName || '-';
      },
    },
    {
      title: isInStoreCondition({ supportEduChainStore: true }) ? '上课校区' : '上课地点',
      bodyRender({ lesson = {} }: IRecordData): string {
        return lesson.shopName || '-';
      },
    },
    {
      title: '实到/应到人次',
      bodyRender({ teacherStatistics = {} }: IRecordData): string {
        return `${teacherStatistics.actualStudentCount}/${teacherStatistics.shouldStudentCount}`;
      },
    },
    {
      title: '课时消耗数',
      bodyRender({ teacherStatistics = {} }: IRecordData): string {
        if (typeof teacherStatistics.consumeAssetNum === 'number') {
          const consumeTime = teacherStatistics.consumeAssetNum / 100;
          return consumeTime.toFixed(2);
        }
        return '-';
      },
    },
    {
      title: '试听人次',
      bodyRender({ teacherStatistics = {} }: IRecordData): string {
        return `${teacherStatistics.tryAttendCount || '-'}`;
      },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      textAlign: 'right',
      nowrap: true,
      bodyRender({ lesson = {} }: IRecordData): ReactElement {
        return <>
          <span style={{ color: '#155bd4', cursor: 'pointer' }} onClick={ () => window.open(`https://www.youzan.com/v4/vis/edu/page/schedule#/detail?lessonNo=${lesson.lessonNo || ''}&kdtId=${lesson.kdtId}`) }>日程详情</span>
        </>;
      },
    },
  ];
};

export const recordOptions: () => any[] = () => [
  {
    type: 'DateRangeQuickPicker',
    name: 'dateRange',
    label: '上课时间：',
    props: {
      max: endOfYesterday(),
      valueType: 'string',
      format: 'YYYY-MM-DD HH:mm',
      preset: [{
        text: '本月',
        value: getCurrentMonth(),
      }, {
        text: '上月',
        value: getLastMonth(),
      }, {
        text: '本周',
        value: getCurrentWeek(),
      }, {
        text: '上周',
        value: getLastWeek(),
      }],
    },
  },
  {
    type: 'Input',
    name: 'eduCourseName',
    label: '课程：',
    props: {
      width: '165px',
      placeholder: '请输入课程名称',
    },
  },
];

export const defaultRecordOptions: IScheduleFilter = {
  dateRange: getCurrentMonth(),
  eduCourseName: '',
};
