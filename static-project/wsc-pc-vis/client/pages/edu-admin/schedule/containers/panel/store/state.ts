import { hashHistory } from 'react-router';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import { IViewData, IListData } from '../types';
import { getCurrentQuery } from '../../../utils/query';
import { date } from '@youzan/utils';

export interface IState {
  type: 'view' | 'list';
  scheduleType: 'day' | 'week' | 'month' | 'custom'; // 日程类型
  showMoreFilter: boolean; // 筛选更多
  data: IViewData; // 面板数据
  tableData: IListData; // 列表数据
  activeId: 0 | 1 | 2 | 3,
  // 课节时间
  startTime: Date; // 开始时间，结束时间可以根据 startTime 计算
  endTime: Date; // 结束时间，自定义时间时需要
  addressId: number; // 上课地点，网店id
  addressName: string | -1; // 上课地点
  kdtId: number; // 上课校区
  appointRule: 0 | 1 | -1; // 预约规则 1：学员预约后才可上课 0：学员无需预约即可上课
  isTrial: 0 | 1 | -1; // 试听规则 1：试听日程，0：正式日程，-1：全部
  classroomNo: string | -1; // 教室编号
  classNo: string | -1; // 班级编号
  eduCourseName: string; // 教务课程名称
  lessonName: string; // 课节名称
  teacherNo: string | -1; // 老师编号
  loading: boolean;
  interval: number; // 时间刻度
  showCategory: string[]; // 看板展示类型
  currentItem: {
    startTime: number;
    endTime: number;
    resourceId?: string;
    id: string | number;
  }
  pageInfo: {
    current: number;
    pageSize: number;
    total: number;
  }
}

export function getInitialState(): IState {
  const { pathname } = hashHistory.getCurrentLocation();
  const query = getCurrentQuery();

  return {
    type: /list/.test(pathname) ? 'list' : 'view',
    showCategory: ['enable', 'conflict', 'deprecated'],
    scheduleType: query.scheduleType || YZLocalStorage.getItem('default_schedule_type') || 'week',
    showMoreFilter: query.showMoreFilter || true,
    startTime: query.startTime ? new Date(query.startTime) : new Date(),
    endTime: query.endTime ? new Date(query.endTime) : date.travel(30, new Date(), 'day'),
    appointRule: query.appointRule || -1,
    isTrial: query.isTrial || -1,
    classroomNo: query.classroomNo || -1,
    classNo: query.classNo || -1,
    eduCourseName: query.eduCourseName || '',
    addressId: query.addressId || -1,
    teacherNo: query.teacherNo || -1,
    addressName: '',
    lessonName: '',
    activeId: 0,
    data: {},
    currentItem: {
      startTime: 0,
      endTime: 0,
      id: '',
    }, // 当前定位item
    pageInfo: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    tableData: {
      content: [],
      total: 0,
      pageable: {
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
        sort: { orders: [] },
      },
    },
    loading: false,
    kdtId: query.kdtId || _global.kdtId,
    interval: +YZLocalStorage.getItem('eduScheduleInterval') || 60,
  };
}
