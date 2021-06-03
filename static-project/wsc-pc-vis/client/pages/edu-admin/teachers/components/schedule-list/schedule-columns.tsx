
import { Pop } from '@zent/compat';
import React, { ReactElement } from 'react';
import { ILessonData, IScheduleFilter } from '../interface';
import { getCurrentMonth, getTomorrow, getCurrentDay, getCurrentWeek } from '../time-utils';
import { APPOINTMENT_RULE } from '../../constants';
import { isInStoreCondition } from 'fns/chain';
import { Icon } from 'zent';

export function scheduleColumns() : any[] {
  return [
    {
      title: '上课时间',
      bodyRender(lesson: ILessonData): string {
        return lesson.lessonTime || '-';
      }
    },
    {
      title: '班级',
      bodyRender(lesson: ILessonData): string {
        return lesson.className || '-';
      }
    },
    {
      title: '课程',
      bodyRender(lesson: ILessonData): string {
        return lesson.eduCourseName || '-';
      }
    },
    {
      title: '课节',
      bodyRender(lesson: ILessonData): string {
        return lesson.lessonName || '-';
      }
    },
    {
      title: isInStoreCondition({ supportEduChainStore: true }) ? '上课校区' : '上课地点',
      bodyRender(lesson: ILessonData): string {
        return (isInStoreCondition({ supportEduChainStore: true }) ? lesson.shopName : lesson.addressName) || '-';
      }
    },
    {
      title: '教室',
      bodyRender(lesson: ILessonData): string {
        return lesson.classroomName || '-';
      }
    },
    {
      title: '预约规则',
      bodyRender(lesson: ILessonData): string {
        return typeof lesson.appointRule === 'number' ? APPOINTMENT_RULE[lesson.appointRule] : '-';
      }
    },
    {
      title: <>
        <span style={{ marginRight: '5px' }}>预约情况</span>
        <Pop trigger='hover' content='已预约人数/可预约人数'>
          <Icon className='teacher-help-icon' type='help-circle-o' />
        </Pop>
      </>,
      bodyRender(lesson: ILessonData): string {
        if (lesson.lessonCase && lesson.appointRule === 1) {
          return lesson.lessonCase.shouldAppointNum ? `${lesson.lessonCase.hadAppointNum}/${lesson.lessonCase.shouldAppointNum}` : '-';
        }
        return '-';
      }
    },
    {
      title: <>
        <span style={{ marginRight: '5px' }}>签到情况</span>
        <Pop trigger='hover' content='有签到状态人数/应到人数'>
          <Icon className='teacher-help-icon' type='help-circle-o' />
        </Pop>
      </>,
      bodyRender(lesson: ILessonData): string {
        const { lessonCase } = lesson || {};
        return lessonCase?.hadSignInNum ? `${lessonCase.hadSignInNum}/${lessonCase.shouldSignInNum}` : '待签到';
      }
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      textAlign: 'right',
      nowrap: true,
      bodyRender(lesson: ILessonData): ReactElement {
        return <>
          <span style={{ color: '#155bd4', cursor: 'pointer' }} onClick={ () => window.open(`https://www.youzan.com/v4/vis/edu/page/schedule#/detail?lessonNo=${lesson.lessonNo || ''}&kdtId=${lesson.kdtId}`) }>日程详情</span>
        </>;
      }
    }
  ];
}

export const scheduleOptions: any[] = [
  {
    type: 'DateRangeQuickPicker',
    name: 'dateRange',
    label: '上课时间：',
    props: {
      valueType: 'string',
      // value: getCurrentMonth(),
      format: 'YYYY-MM-DD HH:mm',
      preset: [{
        text: '今',
        value: getCurrentDay()
      }, {
        text: '明',
        value: getTomorrow()
      }, {
        text: '本周',
        value: getCurrentWeek(false)
      }, {
        text: '本月',
        value: getCurrentMonth(false)
      }]
    }
  },
  {
    type: 'Input',
    name: 'eduCourseName',
    label: '课程：',
    props: {
      width: '165px',
      placeholder: '请输入课程名称'
    }
  }
];

export const defaultScheduleOptions: IScheduleFilter = {
  dateRange: getCurrentMonth(false),
  eduCourseName: ''
};
