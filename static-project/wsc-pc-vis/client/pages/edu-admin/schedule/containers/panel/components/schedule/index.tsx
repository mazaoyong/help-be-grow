import React, { FC, useContext, useRef, useLayoutEffect, useState, useCallback, useMemo, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { BlockLoading, Notify, Pagination, Dialog, Button, Icon } from 'zent';
// import Schedule from '@youzan/ebiz-schedule';
import { Schedule } from '@youzan/ebiz-components';
import { context } from '../../store';
import { IViewCellData, IScheduleViewProps, IViewData } from '../../types';
import ScheduleField from '../field';
import ResourceField from '../resource-field';
import MonthRender from '../month-render';
import BackRow from '../backrow';
import DateUtil from '@youzan/utils/date';
// import { openScheduleDayDialog } from '../schedule-day-dialog';
import './style.scss';
// import { format } from 'date-fns';
import { getScheduleData } from '../../format';
import { getEduConfig } from '../../../../api';
import cloneDeep from 'lodash/cloneDeep';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import { TQueryParams } from '../../../../../../new-dialogs/schedule/types';
import YZLocalStorage from 'zan-utils/local_storage';
import GotoPage from './gotopage';
import PanelDayDialog from '../panel-day-dialog';
import get from 'lodash/get';
import { getTimeLineStart, getTimeLineEnd, isTimeinRange, getFirstTimeline, getHourPlusMinuteFromTime, paddingTime } from './timeline';
// import { NOTICE_URL } from './constants';

const { getCurrentWeek, formatDate } = DateUtil;

const VIEWS: IScheduleViewProps[] = ['timeline', 'teacher', 'class', 'classroom'];

const ScheduleWrap: FC<{}> = () => {
  const [timeRange, setTimeRange] = useState([420, 1320]); // 默认时间范围（分钟数）
  const [showMask, setMask] = useState<boolean>(() => {
    const flag = YZLocalStorage.getItem('non_schedule_first-visit');
    !flag && YZLocalStorage.setItem('non_schedule_first-visit', true);
    return !flag;
  },
  );

  const { store, dispatch } = useContext(context);
  const scheduleEl = useRef(null);

  const { scheduleType, data, startTime, loading, interval, pageInfo, activeId, showCategory } = store;

  const latestSchedule = useMemo(() => {
    const currentItem = YZLocalStorage.getItem('schedule_latest_info');
    if (currentItem) {
      YZLocalStorage.setItem('schedule_latest_info', null);
    }
    return currentItem ? JSON.parse(currentItem) : null;
  }, [ data ]); // 通过数据变更清楚新建排课定位

  // 过滤冲突，已上课，待上课数据
  const getFilterData = useCallback<(item: any) => any >((item) => {
    let filters = [...item];
    if (!showCategory.includes('conflict')) {
      filters = filters.filter(item => item.conflictResources === '0' || item.endTime <= new Date().getTime());
    }
    if (!showCategory.includes('enable')) {
      filters = filters.filter(item => item.endTime <= new Date().getTime() || item.conflictResources !== '0');
    }
    if (!showCategory.includes('deprecated')) {
      filters = filters.filter(item => item.endTime > new Date().getTime());
    }
    return filters;
  }, [showCategory]);

  const filterData = useMemo<any>(() => {
    let filters = {};
    const cloneData = cloneDeep(data);
    Object.keys(cloneData).map(item => {
      if (activeId) {
        const subData = getFilterData(cloneData[item] ? cloneData[item]['data'] : []);
        filters[item] = {
          ...cloneData[item],
          ...{ data: subData },
        };
      } else {
        const subData = getFilterData(cloneData[item] || []);
        filters[item] = subData;
      }
    });
    return filters;
  }, [data, activeId, getFilterData]);

  // 教务设置起始时间
  const startShowTime = useMemo<string>(() => {
    let startHour: number = Math.floor(timeRange[0] / 60);
    let startMinute: number = timeRange[0] - startHour * 60;
    if (startMinute % interval !== 0) {
      startMinute -= startMinute % interval;
    }
    return `${paddingTime(startHour)}:${paddingTime(startMinute)}`;
  }, [timeRange, interval]);

  // 教务设置结束时间
  const endShowTime = useMemo<string>(() => {
    let endHour: number = Math.floor(timeRange[1] / 60);
    let endMinute: number = timeRange[1] - endHour * 60;

    if (endMinute % interval !== 0) {
      endMinute = Math.ceil(endMinute / interval) * interval;
      if (endMinute % 60 === 0) {
        endHour += 1;
        endMinute = 0;
      }
    }
    return `${paddingTime(endHour)}:${paddingTime(endMinute)}`;
  }, [timeRange, interval]);

  const onPageChange = useCallback((options) => {
    getScheduleData({ pageNumber: options.current }, store, dispatch, activeId);
  }, [activeId, store, dispatch]);

  const onFieldClick = useCallback<(day: string, resource: { [index: string]: any }) => void>((day, resource = {}) => {
    const params: Partial<TQueryParams> = {
      startTime: day,
    };
    switch (activeId) {
      case 1:
        params['teacherName'] = resource.resourceName;
        params['teacherNo'] = resource.resourceId;
        break;
      case 3:
        params['classroomNo'] = resource.resourceId;
        params['classroomName'] = resource.resourceName;
        break;
      case 2:
        params['classNo'] = resource.resourceId;
        break;
    }

    ScheduleNewDialog.open('新建日程', {
      query: {
        ...params,
      },
      kdtId: get(resource, 'restInfo.kdtId') || _global.kdtId,
      afterSaveSucceed: (submitData: any, scheduleId: string) => {
        if (!activeId) {
          GotoPage(submitData, store, dispatch, scheduleId);
        } else {
          getScheduleData({ pageNumber: pageInfo.current }, store, dispatch, activeId);
        }
      },
    });
  }, [ activeId, pageInfo, store, dispatch ]);

  const onMonthClick = useCallback<(day: string) => void>((day) => {
    const params: Partial<TQueryParams> = {
      startTime: day,
    };

    ScheduleNewDialog.open('新建日程', {
      query: {
        ...params,
      },
      afterSaveSucceed: (submitData: any, scheduleId: string) => {
        GotoPage(submitData, store, dispatch, scheduleId);
      },
    });
  }, [ store, dispatch ]);

  // 拖拽排序
  const endDrag = useCallback<(startTime: number, endTime: number) => void>((startTime, endTime: number) => {
    if (new Date(endTime).getDay() !== new Date(startTime).getDay()) {
      Notify.error('无法跨天排课');
      return;
    }
    if (!activeId && startTime !== endTime) {
      const params = {
        startTime: formatDate(Math.min(startTime, endTime), 'YYYY-MM-DD HH:mm:ss'),
        endTime: formatDate(Math.max(startTime, endTime) + (interval - 1) * 60 * 1000, 'YYYY-MM-DD HH:mm:ss'),
      };

      ScheduleNewDialog.open('新建日程', {
        query: {
          ...params,
        },
        afterSaveSucceed: (submitData: any, scheduleId: string) => {
          if (!activeId) {
            GotoPage(submitData, store, dispatch, scheduleId);
          } else {
            getScheduleData({ pageNumber: pageInfo.current }, store, dispatch, activeId);
          }
        },
      });
    }
  }, [ activeId ]);

  // 筛选时间范围内数据
  const filterWeekData = useCallback<(data: IViewCellData[], filterData: IViewData) =>
  IViewCellData[]>((data, filterData) => {
      if (!data || !data.length) {
        return data;
      }
      const startTimeLine: number = getTimeLineStart(startShowTime, filterData, interval);
      const endTimeLine: number = getTimeLineEnd(endShowTime, filterData, interval);
      return data.filter(item => {
        const itemStartDate = new Date(item.startTime || 0);
        const itemEndDate = new Date(item.endTime || 0);
        const itemStartTime = itemStartDate.getHours() * 60 + itemStartDate.getMinutes();
        const itemEndTime = itemEndDate.getHours() * 60 + itemEndDate.getMinutes();
        return !(itemEndTime <= startTimeLine || itemStartTime >= endTimeLine);
      });
    }, [startShowTime, endShowTime, interval]);

  // 获取timeLine开始结束时间
  useLayoutEffect(() => {
    getEduConfig().then(resp => {
      if (!resp) {
        return;
      }
      setTimeRange([resp.kanbanStartTime, resp.kanbanEndTime]);
    }).catch(err => {
      Notify.error(err);
    });
  }, []);

  // 切换回日看板时 dom 初始化
  useLayoutEffect(() => {
    if (scheduleType !== 'day') {
      const $schedule = document.getElementsByClassName('ebiz-schedule')[0];
      $schedule.className = 'ebiz-schedule';
    }
  }, [scheduleType]);

  // 数据加载后判断是否显示滚动加载更多
  useLayoutEffect(() => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(scheduleEl.current) as HTMLElement;
    const $day = node.getElementsByClassName('ebiz-schedule__day')[0];
    const $panel = node.getElementsByClassName('ebiz-schedule__day__panel')[0];

    if ($day && $panel) {
      const dayWidth = $day.getBoundingClientRect().width;
      const panelWidth = $panel.getBoundingClientRect().width;
      const $schedule = document.getElementsByClassName('ebiz-schedule')[0];
      if (dayWidth < panelWidth) {
        if ($schedule) {
          $schedule.className += ' schedule-scroll';
        }
      }
    }
  }, [data]);

  // 滚动加载更多判断
  useLayoutEffect(() => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(scheduleEl.current) as HTMLElement;
    const $day = node.getElementsByClassName('ebiz-schedule__day')[0];
    const $panel = node.getElementsByClassName('ebiz-schedule__day__panel')[0];
    if ($day && $panel) {
      $day.addEventListener('scroll', e => {
        const scrollLeft = (e.target as HTMLElement).scrollLeft;
        const panelWidth = $panel.getBoundingClientRect().width;
        const dayWidth = $day.getBoundingClientRect().width;
        const $schedule = document.getElementsByClassName('ebiz-schedule')[0];
        if (dayWidth > panelWidth - scrollLeft) {
          $schedule.className = 'ebiz-schedule';
        } else {
          $schedule.className = 'ebiz-schedule schedule-scroll';
        }
      });
    }
  }, []);

  // 当天滚动到当前时间
  useEffect(() => {
    if (activeId) {
      return;
    }

    let startUseTime = latestSchedule ? latestSchedule.startTime : null;
    const startVisibleTimeLine: number = getTimeLineStart(startShowTime, filterData, interval);
    const endVisibleTimeLine: number = getTimeLineEnd(endShowTime, filterData, interval);
    if (!startUseTime ||
       !isTimeinRange(latestSchedule.startTime, latestSchedule.endTime, startVisibleTimeLine, endVisibleTimeLine)) {
      startUseTime = getFirstTimeline(filterData, startVisibleTimeLine, endVisibleTimeLine);
    }

    if (startUseTime) {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(scheduleEl.current) as HTMLElement;
      let $day;
      if (scheduleType === 'day') {
        $day = node.getElementsByClassName('ebiz-schedule__day')[0];
      } else if (scheduleType === 'week') {
        $day = node.getElementsByClassName('ebiz-schedule__week__panel__wrap')[0];
      }
      if ($day && 'scrollBehavior' in document.documentElement.style) {
        const panelStartTime: number = getHourPlusMinuteFromTime(startUseTime);

        $day.scrollTo({
          top: ((panelStartTime - startVisibleTimeLine) / interval) * 120, // 每 15 分钟高度为 50 px
        });
      }
    }
  }, [timeRange, scheduleType, activeId, startTime, latestSchedule, interval, startShowTime, endShowTime, filterData]);

  return (<>
    <BlockLoading className="schedule__loading__wrap" loading={loading}>
      <div className="panel__schedule" style={{ height: scheduleType !== 'month' ? 'calc(100vh - 120px)' : 'auto' }}>
        <Schedule
          // @ts-ignore @todo 这个类型在@youzan/ebiz-schedule包里
          type={activeId ? 'week' : scheduleType}
          view={VIEWS[activeId]}
          data={filterData}
          timeLineStart={startShowTime}
          timelineEnd={endShowTime}
          max={2}
          interval={interval}
          rowHeight={120}
          ref={scheduleEl}
          current={new Date(startTime)}
          endDrag={endDrag}
          renderWeekDays={(date: Date) => {
            const currentDate: string = formatDate(date, 'YYYY-MM-DD');
            const weekData = filterWeekData(filterData[currentDate], filterData);
            const scheduleNum:number = weekData ? weekData.length : 0;
            const isToday: boolean = scheduleType === 'week' && formatDate(new Date(), 'YYYY-MM-DD') === formatDate(date, 'YYYY-MM-DD');

            return <div className='schedule-week-header'>
              { isToday && <Icon className="schedule-week-header__icon" type='caret-down'/>}
              <p className={`schedule-week-header__${isToday ? 'today' : 'content'}`}>{`${getCurrentWeek(date)} ${formatDate(date, 'M-DD')}`}</p>
              {!store.activeId && <div className={`schedule-week-header__${scheduleNum ? 'enabled' : 'disabled'}`} onClick={() => {
                if (scheduleNum) {
                  PanelDayDialog.open({
                    defaultData: weekData,
                    time: date,
                    callback: () => {},
                    store,
                    dispatch,
                    timeLineStart: getTimeLineStart(startShowTime, filterData, interval),
                    timelineEnd: getTimeLineEnd(endShowTime, filterData, interval),
                  });
                }
              }}>共{scheduleNum}个排课</div>}
            </div>;
          }}
          renderField={fieldData => {
            return <>
              {!store.activeId && <ScheduleField
                latestSchedule={latestSchedule} data={fieldData as IViewCellData} store={store} dispatch={dispatch} />}
              {!!store.activeId &&
              <ResourceField filterData={fieldData} store={store} dispatch={dispatch} onFieldClick={onFieldClick} />
              }
            </>;
          }}
          dateFullCellRender={(data, date) => {
            return <MonthRender date={date} data={data as IViewCellData[]} onMonthClick={onMonthClick} />;
          }}
          renderBackRow={time => {
            return <BackRow store={store} dispatch={dispatch} date={time} />;
          }}
        />
        {!!store.activeId && <Pagination
          className={'schedule__view__pagination'}
          current={pageInfo.current}
          pageSize={pageInfo.pageSize}
          total={pageInfo.total}
          onChange={onPageChange}
        />}
      </div>
    </BlockLoading>
    <Dialog
      visible={showMask}
      className="schedule__notice"
      closeBtn={false}
      maskClosable={true}
      onClose={() => setMask(false)}
    >
      <p className="schedule__notice__subtitle">课程已调整到“课程-线下课程”，点击跳转。</p>
      <div className="schedule__notice__btn"><Button type='primary' onClick={() => {
        setMask(false);
        location.href = `${_global.url.v4}/vis/edu/page/educourse#/list`;
      }}>我知道了，立即跳转</Button></div>
    </Dialog>
  </>
  );
};

export default ScheduleWrap;
