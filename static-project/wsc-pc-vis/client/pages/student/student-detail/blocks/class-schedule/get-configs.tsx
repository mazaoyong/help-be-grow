import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import format from 'date-fns/format';
import { ICombinedFilterConf, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { isInStoreCondition } from 'fns/chain';
import { openSignInDialog } from '@ability-center/appointment/signin-util';
import { Operations } from '@youzan/react-components';
import get from 'lodash/get';

const { DatePickerTypes } = EasyList;

const getClassScheduleConfig = (
  initialValue: Partial<IFilterFields> = {},
): ICombinedFilterConf[] => [
  {
    name: 'rangeTime',
    label: '日期：',
    type: DatePickerTypes.DateRangePicker,
    defaultValue: initialValue.rangeTime,
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

function showLessonName(item: IRowDataItem) {
  const { courseType, lessonName, eduCourse, course } = item;
  if (courseType === 0) {
    return course.title;
  }
  return lessonName || eduCourse.name;
}
interface IGetClassScheduleContext {
  state: {
    eduConfig?: {
      writeOffRuleLeave: boolean;
      writeOffRuleTruancy: boolean;
    };
    handleUpdate(): void;
  };
}
function getClassScheduleColumns(
  context: IGetClassScheduleContext,
): IEasyGridColumn<IRowDataItem>[] {
  const { eduConfig, handleUpdate } = context.state;
  let showLeaveConsumeInfo = true;
  let showTruancyConsumeInfo = true;
  if (eduConfig) {
    const { writeOffRuleLeave, writeOffRuleTruancy } = eduConfig;
    showLeaveConsumeInfo = !!writeOffRuleLeave;
    showTruancyConsumeInfo = !!writeOffRuleTruancy;
  }
  return [
    {
      title: '日期',
      width: 180,
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
      width: 180,
      nowrap: true,
      bodyRender: ({ startTime, endTime }) => {
        if (!startTime) return '-';
        return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
      },
    },
    {
      title: '课程',
      width: 200,
      nowrap: true,
      bodyRender: rowData => <div className="ellipsis">{showLessonName(rowData)}</div>,
    },
    {
      title: '课程类型',
      width: 120,
      nowrap: true,
      bodyRender: ({ courseType }) => (courseType ? '正式课' : '体验课'),
    },
    {
      title: '上课地点',
      width: 200,
      nowrap: true,
      visible: isInStoreCondition({
        supportBranchStore: true,
        supportSingleStore: true,
      }),
      bodyRender: rowData => get(rowData, 'courseAttendDTO.address', '-'),
    },
    {
      title: '上课校区',
      width: 200,
      nowrap: true,
      visible: isInStoreCondition({
        supportHqStore: true,
      }),
      defaultText: '-',
      bodyRender: rowData => get(rowData, 'campus.name', '-'),
    },
    {
      title: '教室',
      nowrap: true,
      name: 'classroomName',
      defaultText: '-',
    },
    {
      title: '老师',
      nowrap: true,
      width: 100,
      name: 'teacherName',
      defaultText: '-',
    },
    {
      title: '签到状态',
      width: 100,
      nowrap: true,
      bodyRender: (rowData: Record<string, any>) => {
        const { lessonState } = rowData;
        const description = COURSE_STATUS[lessonState];
        const statusCls = COURSE_CLASS[lessonState];

        return <div className={`withDot course-${statusCls}`}>{description}</div>;
      },
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      nowrap: true,
      textAlign: 'right',
      bodyRender: (rowData: Record<string, any>) => {
        const {
          lessonState = 0,
          consumeCourseTime,
          studentName,
          userContractNo,
          startTime,
          kdtId,
        } = rowData;
        const items =
          lessonState === 0 && startTime > 0
            ? [
              <a
                key="signIn"
                onClick={() =>
                  openSignInDialog({
                    afterSignIn: handleUpdate,
                    signInType: 0,
                    consumeNum: consumeCourseTime,
                    studentLessonNos: [userContractNo],
                    studentName: studentName,
                    startTime,
                    kdtId,
                  })
                }
              >
                  签到
              </a>,
              <a
                key="askForLeave"
                className="show-devide"
                onClick={() =>
                  openSignInDialog({
                    afterSignIn: handleUpdate,
                    signInType: 1,
                    consumeNum: showLeaveConsumeInfo ? consumeCourseTime : 0,
                    studentLessonNos: [userContractNo],
                    studentName: studentName,
                    startTime,
                    kdtId,
                  })
                }
              >
                  请假
              </a>,
              <a
                key="absent"
                className="show-devide"
                onClick={() =>
                  openSignInDialog({
                    afterSignIn: handleUpdate,
                    signInType: 2,
                    consumeNum: showTruancyConsumeInfo ? consumeCourseTime : 0,
                    studentLessonNos: [userContractNo],
                    studentName: studentName,
                    startTime,
                    kdtId,
                  })
                }
              >
                  未到
              </a>,
            ]
            : [];
        return <Operations items={items} />;
      },
    },
  ];
}

export default getClassScheduleConfig;
export { getClassScheduleColumns, showLessonName };

type DateType = Date | string | number;
export interface IFilterFields extends Record<string, any> {
  title: string;
  rangeTime: [DateType, DateType];
}

interface IEduCourse {
  alias: string;
  applicableCampusList: any[];
  applicableCampusType: number;
  applyType: number;
  className: string;
  classNum: number;
  createdAt: number;
  id: number;
  kdtId: number;
  maxApply: number;
  minApply: number;
  name: string;
  productNum: number;
  teachType: number;
  updatedAt: number;
}
interface IAsset {
  assetNo: string;
  assetOriginType: number;
  dataRange: {
    endTime: number;
    startTime: number;
  };
  joinState: any;
  lock: number;
  numeric: number;
  remaining: number;
  status: number;
  studentName: string;
  studentUid: number;
  total: number;
  type: number;
  used: number;
}
interface IRowDataItem {
  campus: any;
  classId: number;
  classroomId: number;
  classroomName: string;
  consumeCourseTime: number;
  course: any;
  courseAttendDTO: Record<string, any>;
  courseType: number;
  eduCourse: IEduCourse;
  eduCourseId: number;
  endTime: number;
  hasAppointment: number;
  kdtId: number;
  lessonName: string;
  lessonNo: string;
  lessonState: number;
  pictureWrap: any;
  startTime: number;
  state: number;
  studentName: string;
  teacherName: string;
  userAsset: IAsset;
  userContractNo: string;
  week: number;
}
