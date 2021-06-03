// 格式化并查询面板数据
import { Notify } from 'zent';
import { StateType, DispatchType } from './store';
import { has } from 'lodash';
import { getScheduleViewAPIV2, getScheduleListAPI, findResourceKanBanPageV2 } from '../../api';
import { addDays, addWeeks, addMonths, startOfWeek, startOfMonth } from 'date-fns';
import { setQuery } from '../../utils/query';
import cloneDeep from 'lodash/cloneDeep';

export interface IPageRequestProps {
  pageNumber: number;
  pageSize: number;
  countEnabled?: boolean;
  sort?: {
    orders: any[];
  }
}

export interface IResourceDataProps {
  resourceName: string;
  resourceNo: string;
  kdtId: number;
  lessonKanBanMap: {
    [index: string]: any;
  }
}

export interface IPanelRequest {
  type?: 'view' | 'list';
  scheduleType?: 'day' | 'week' | 'month' | 'custom'; // 日程类型
  startTime?: number | Date | string; // 开始时间，结束时间可以根据 startTime 计算
  addressId?: number; // 上课地点，网店id
  kdtId?: number;
  appointRule?: 0 | 1 | -1; // 预约规则 1：学员预约后才可上课 0：学员无需预约即可上课
  classroomNo?: string | -1; // 教室编号
  classNo?: string | -1; // 班级编号
  eduCourseName?: string; // 教务课程名称
  lessonName?: string; // 课节名称
  teacherNo?: string | -1; // 老师编号
  endTime?: number | Date | string;
  pageNumber?: number;
  resourceType?: number;
}

function formatResourceData(data: IResourceDataProps[]) {
  const cloneData = cloneDeep(data);
  const formatData = {};
  cloneData.map(item => {
    let currentResourseData: any[] = [];
    Object.keys(item.lessonKanBanMap || []).map(dateItem => {
      const formatDateItem = item.lessonKanBanMap[dateItem].map(dateValue => {
        return { ...dateValue };
      });
      currentResourseData = [...currentResourseData, ...formatDateItem];
    });
    formatData[item.resourceNo] = {
      data: currentResourseData,
      resourceName: item.resourceName,
      restInfo: {
        kdtId: item.kdtId || _global.kdtId,
      },
    };
  });
  return formatData;
}

export function formatQuery(state: StateType): IPanelRequest {
  const query: IPanelRequest = {
    startTime: state.startTime,
  };

  [
    'classNo',
    'eduCourseName',
    'lessonName',
    'kdtId',
  ].forEach(key => {
    if (has(state, key) && state[key] !== '') {
      if (key === 'classNo' && +state[key] === -1) {
        return;
      }
      query[key] = state[key];
    }
  });

  // 过滤空字符串
  [
    'classNo',
    'classroomNo',
    'appointRule',
    'isTrial',
    'addressId',
  ].forEach(key => {
    let value = state[key]
    if (Array.isArray(value) && parseInt(value[0]) !== -1) {
      query[key] = value[0];
    }
  });

  [
    'teacherNos',
    'assistantNos',
  ].forEach(key => {
    if (has(state, key) && state[key].length !== 0) {
      query[key] = state[key];
    }
  });

  let { scheduleType } = state;
  if(Array.isArray(scheduleType)){
    scheduleType = scheduleType[0];
  }
  let startTime = new Date(state.startTime);
  startTime.setHours(0, 0, 0, 0); // 设置开始时间为 0 点

  let endTime: Date = startTime!;

  switch (scheduleType) {
    case 'day':
      endTime = addDays(startTime, 1);
      break;
    case 'week':
      startTime = startOfWeek(startTime, { weekStartsOn: 1 });
      endTime = addWeeks(startTime, 1);
      break;
    case 'month':
      startTime = startOfMonth(startTime);
      endTime = addMonths(startTime, 1);
      break;
    case 'custom':
      endTime = new Date(state.endTime);
      endTime.setHours(23, 59, 59, 999);
      break;
  }

  query.endTime = endTime.getTime();
  query.startTime = startTime.getTime();

  if (!query.kdtId) {
    query.kdtId = _global.kdtId;
  }

  return query;
}

// 格式化并查询视数据
export function getScheduleData(
  data: Partial<IPanelRequest>,
  store: StateType,
  dispatch: DispatchType,
  activeId?: number,
) {
  const state: StateType & IPanelRequest = Object.assign({}, store, data);
  // data 设置为空对象，清空面板数据
  dispatch({ type: 'setFilter', value: { ...state, loading: true } });
  setQuery(state);
  const req: IPanelRequest = formatQuery(state);
  if (state.type === 'view') {
    if (!activeId) {
      getScheduleViewAPIV2(req)
        .then((res = []) => {
          dispatch({
            type: 'setViewData',
            value: {
              loading: false,
              data: res,
            },
          });
        })
        .catch(err => {
          dispatch({ type: 'loading', value: false });
          Notify.error(err);
        });
    } else {
      req.resourceType = activeId;
      const { pageSize } = store.pageInfo;
      const pageRequest: IPageRequestProps = { pageNumber: data.pageNumber || 1, pageSize };

      findResourceKanBanPageV2({ pageRequest, query: req }).then(resp => {
        if (resp && resp.content) {
          dispatch({
            type: 'setViewData',
            value: {
              loading: false,
              data: formatResourceData(resp.content),
            },
          });

          dispatch({
            type: 'setPageInfo',
            value: {
              ...store.pageInfo,
              ...{
                current: resp.pageable ? resp.pageable.pageNumber : 1,
                total: resp.total || 0,
              },
            },
          });
        }
      }).catch(err => {
        Notify.error(err);
      });
    }
  } else {
    const page = {
      pageNumber: data.pageNumber || store.tableData.pageable.pageNumber,
      pageSize: 10,
      sort: store.tableData.pageable.sort || { orders: [] },
    };

    getScheduleListAPI({
      query: req,
      page,
    })
      .then(({ content = [], pageable, total }) => {
        const pagination = store.tableData.pageable || pageable;
        dispatch({
          type: 'setListData',
          value: {
            loading: false,
            data: {
              content,
              pageable: pagination,
              total,
            },
          },
        });
      })
      .catch(err => {
        dispatch({ type: 'loading', value: false });
        Notify.error(err);
      });
  }
}
