import { hashHistory } from 'react-router';
import { StateType } from '../containers/panel/store';
import { IPanelRequest } from '../containers/panel/format';
import { has, get } from 'lodash';

interface IQueryData {
  scheduleType?: 'day' | 'week' | 'month'; // 日程类型
  showMoreFilter?: boolean; // 筛选更多
  startTime?: number; // 开始时间，结束时间可以根据 startTime 计算
  endTime?: number; // 结束时间，自定义模式下需要
  addressId?: number; // 上课地点，网店id
  appointRule?: 0 | 1; // 预约规则 1：学员预约后才可上课 2：学员无需预约即可上课
  isTrial?: 0 | 1 | -1; // 试听规则 1：试听日程，0：正式日程，-1：全部
  classroomNo?: string; // 教室编号
  classNo?: string; // 班级编号
  eduCourseName?: string; // 教务课程名称
  lessonName?: string; // 课节名称
  teacherNo?: string; // 老师编号
  pageNumber?: number; // 页码
  pageSize?: number; // 页数
  kdtId?: number; // 校区
}

// 获取当前路由 query
export function getCurrentQuery(): Partial<IQueryData> {
  const { query = {} } = hashHistory.getCurrentLocation();

  // 转换数字
  ['startTime', 'pageNumber', 'pageSize'].forEach(key => {
    if (has(query, key)) {
      // @ts-ignore
      query[key] = parseInt(query[key]);
    }
  });

  if (has(query, 'showMoreFilter')) {
    // @ts-ignore
    query.showMoreFilter = query.showMoreFilter === 'true';
  }

  return query;
}

// 映射到路由
export function setQuery(data: Partial<StateType & IPanelRequest>): void {
  const location = Object.assign({}, hashHistory.getCurrentLocation());
  const query: IQueryData = {};
  if (has(data, 'startTime')) {
    query.startTime = new Date(data.startTime!).getTime();
  }

  [
    'scheduleType',
    'showMoreFilter',
    'classroomNo',
    'classNo',
    'eduCourseName',
    'lessonName',
    'teacherNo',
    'kdtId',
  ].forEach(key => {
    if (has(data, key) && get(data, key) !== '') {
      query[key] = data[key];
    }
  });

  if (has(data, 'appointRule') && data.appointRule !== -1) {
    query.appointRule = data.appointRule;
  }

  if (has(data, 'addressId') && data.addressId !== -1) {
    query.addressId = data.addressId;
  }

  if (has(data, 'isTrial') && data.isTrial !== -1) {
    query.isTrial = data.isTrial;
  }

  // 列表下分页
  if (/list/.test(location.pathname)) {
    query.pageNumber = data.pageNumber || get(data, 'tableData.pageable.pageNumber') || 1;
    query.pageSize = get(data, 'tableData.pageable.pageSize') || 10;
  }

  // @ts-ignore
  location.query = query;

  hashHistory.replace(location);
}
