import React, { Component } from 'react';
import PanelCell from './components/panel-cell';
import PanelHeader from './components/panel-header';
// import PanelFooter from './components/panel-footer';
import { BlockLoading, Notify } from 'zent';
import { Schedule } from '@youzan/ebiz-components';
import AppointmentDialog from '../../components/dialog-appointment';
import PanelDayDialog from './components/panel-day-dialog';
import BackRow from './components/backrow';
import WeekTitle from './components/week-title';
import { findDOMNode } from 'react-dom';
// import { mockData } from './mock';

import { genQuarterAllDay, formatMinutesToHHMM, deleteEmptyProperty } from '../../utils';
import { APPOINTMENT_SCHEDULE_TYPE, APPOINTMENT_STATUS_TYPE } from '../../constants';
import makeDateTimeStr from 'zan-utils/date/makeDateTimeStr';
import formatDate from 'zan-utils/date/formatDate';
import parseDate from 'zan-utils/date/parseDate';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import { addWeeks, startOfWeek } from 'date-fns';
// import debounce from 'lodash/debounce';
import { getOverLap, isTimeinRange, getFirstTimeline, getTimeLineStart, getTimeLineEnd, getHourPlusMinuteFromTime } from './time-util';
import { getAppointmentKanban, getEduConfig } from '../../api';

const dayMs = 24 * 60 * 60 * 1000;
const weekMs = 7 * dayMs;
const quarters = genQuarterAllDay();
const dateNow = Date.now();
const now = makeDateTimeStr(
  dateNow % (15 * 60 * 1000) === 0 ? dateNow + 60 * 1000 : dateNow,
  'HH:mm', // 刚好等于15刻度的情况多加一分钟
);
const nowQuarter = formatMinutesToHHMM(now.slice(0, 2) * 60 + Math.ceil(now.slice(-2) / 15) * 15);
// const height = quarters.length * 51 + 10 + 'px'; // 高度和时间轴保持一致，不然在这个区域内也会出现滚动条
let reservePanelContentRightEle = null;
let panelDayEle = null;
let reservePanelContent = null;

// 新的部分
let day = new Date().getDay();
day === 0 && (day = 7);
day -= 1;

export default class ReservePanelPage extends Component {
  state = {
    filter: {},
    loading: false,
    scheduleType: APPOINTMENT_SCHEDULE_TYPE.DAY, // 面板视图类型
    dateValue: formatDate(dateNow, 'YYYY-MM-DD'),
    dateRange: [formatDate(dateNow - weekMs, 'YYYY-MM-DD'), formatDate(dateNow, 'YYYY-MM-DD')],
    weekStart: Date.now() - dayMs * day,
    panelData: {},
    rawPanelData: {},
    appointmentNum: 0,
    reserveStatus: {
      1: true,
      2: true,
      4: true,
    },
    showScrollTip: false, // x轴向滚动
    timeRange: [420, 1320], // 默认时间范围（分钟数）
    interval: +YZLocalStorage.getItem('eduAppointmentInterval') || 60, // 时间间隔
  };

  filterStatus = reserveStatus => {
    this.setState({ reserveStatus }, () => {
      // todo
    });
  };

  filterPanelData = (startShowTime, endShowTime) => {
    const { reserveStatus, panelData } = this.state;
    const temp = {};

    (Object.keys(panelData) || []).map(key => {
      const appointments = [];
      (panelData[key] || []).map(appointment => {
        // 1 2 467
        const statusList = Object.keys(reserveStatus) || [];
        for (let i = 0; i < statusList.length; i++) {
          const status = statusList[i];
          if (reserveStatus[status]) {
            if (+status === +appointment.status) {
              appointments.push(appointment);
              break;
            } else if (
              +appointment.status === APPOINTMENT_STATUS_TYPE.ABSENCE ||
              +appointment.status === APPOINTMENT_STATUS_TYPE.ASK_FOR_LEAVED
            ) {
              appointments.push(appointment);
              break;
            }
          }
        }
      });
      temp[key] = appointments;
    });

    return temp;
  };

  filterSettingsData = (data, startTimeLine, endTimeLine) => {
    return data.filter(item => {
      const itemStartDate = new Date(item.startTime || 0);
      const itemEndDate = new Date(item.endTime || 0);
      const itemStartTime = itemStartDate.getHours() * 60 + itemStartDate.getMinutes();
      const itemEndTime = itemEndDate.getHours() * 60 + itemEndDate.getMinutes();
      return !(itemEndTime < startTimeLine || itemStartTime > endTimeLine);
    });
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
    if (key === 'interval') {
      YZLocalStorage.setItem('eduAppointmentInterval', value);
    }
  };

  onSearch = (key, value) => {
    this.setState({ [key]: value }, () => {
      this.updateKanbanData();
      // this.scrollToTime();
    });
  };

  genParam = () => {
    const { filter, dateValue, scheduleType, weekStart } = this.state;
    const dateNow = +parseDate(dateValue, 'YYYY-MM-DD');
    const param = {
      ...filter,
    };
    // if (selectValue) {
    //   param[selectValue] = inputValue;
    // }
    if (scheduleType === APPOINTMENT_SCHEDULE_TYPE.DAY) {
      param.startTime = dateNow;
      param.endTime = dateNow + dayMs - 1000;
    } else {
      let startTime = new Date(weekStart);

      startTime.setHours(0, 0, 0, 0); // 设置开始时间为 0 点

      let endTime = startTime;

      startTime = startOfWeek(startTime, { weekStartsOn: 1 });
      endTime = addWeeks(startTime, 1);

      param.endTime = endTime.getTime();
      param.startTime = startTime.getTime();
    }
    return deleteEmptyProperty(param);
  };

  getAppointmentKanban = (param = {}) => {
    this.setState({ loading: true });
    getAppointmentKanban({ filter: param })
      .then(data => {
        const dailyAppointments = (data && data.dailyAppointments) || {};
        const totalAppointmentNum = data && data.totalAppointmentNum;
        const rawPanelData = this.formatPanelData(dailyAppointments);
        this.setState({
          appointmentNum: totalAppointmentNum,
          panelData: rawPanelData,
          rawPanelData,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  formatPanelData = (data = {}) => {
    // const { scheduleType } = this.state;
    const temp = {};
    (Object.keys(data) || []).map(key => {
      const studentLessons = (data[key] || {}).studentLessons || [];
      temp[key] = studentLessons.map(item => {
        item.studentLessonStatus = item.status;
        item.trueEndTime = item.endTime;
        return item;
      });
    });
    return temp;
  };

  experience = () => {
    setTimeout(() => {
      // 1. 如果时间是今天，自动滚动到当前位置
      this.isToday() && (reservePanelContent.scrollTop = 50 * (quarters.indexOf(nowQuarter) - 3));
      // 2. 宽度需要手动设置，超过100%之后不会自动伸长了
      panelDayEle.style.width = reservePanelContentRightEle.scrollWidth + 'px';
      this.calcXScrollEnable();
    });
  };

  isToday = date => {
    return formatDate(new Date(), 'YYYY-MM-DD') === formatDate(date, 'YYYY-MM-DD');
  };

  updateKanbanData = () => {
    this.getAppointmentKanban(this.genParam());
  };

  scrollToTime = () => {
    const { scheduleType, interval } = this.state;
    const latestSchedule = JSON.parse(YZLocalStorage.getItem('appointment_latest_info'));
    const data = this.filterPanelData();
    const startShowTime = this.getStartTimeLine();
    const endShowTime = this.getEndTimeLine();
    const startVisibleTimeLine = getTimeLineStart(startShowTime, data, interval);
    const endVisibleTimeLine = getTimeLineEnd(endShowTime, data, interval);
    let startUseTime = latestSchedule ? latestSchedule.startTime : null;
    if (!startUseTime ||
       !isTimeinRange(latestSchedule.startTime, latestSchedule.endTime, startVisibleTimeLine, endVisibleTimeLine)) {
      startUseTime = getFirstTimeline(data, startVisibleTimeLine, endVisibleTimeLine);
    }
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this.scheduleEl);
    let $day;
    if (scheduleType === 'day') {
      $day = node.getElementsByClassName('ebiz-schedule__day')[0];
    } else if (scheduleType === 'week') {
      $day = node.getElementsByClassName('ebiz-schedule__week__panel__wrap')[0];
    }
    if ($day && 'scrollBehavior' in document.documentElement.style) {
      const panelStartTime = getHourPlusMinuteFromTime(startUseTime);
      $day.scrollTo({
        top: Math.floor((panelStartTime - startVisibleTimeLine) / interval) * 120, // 每 15 分钟高度为 50 px
      });
    }
  }

  getTimeRangeConfig = () => {
    getEduConfig().then(resp => {
      if (!resp) {
        return;
      }
      this.setState({
        timeRange: [resp.kanbanStartTime, resp.kanbanEndTime],
      });
      // }, () => {
      //   this.scrollToTime();
      // });
    }).catch(err => {
      Notify.error(err);
    });
  }

  // handleScroll = () => {
  //   this.calcXScrollEnable();
  // };

  onTeacherChange = (e) => {
    this.setState({
      filter: { ...this.state.filter, teacherName: e.target.value },
    });
  }

  onCourseTypeChange = (value) => {
    this.setState({
      filter: { ...this.state.filter, courseType: value },
    });
  }

  openAppointmentDialog = time => {
    AppointmentDialog.open({
      defaultData: { time },
      callback: (params) => {
        if (params && params.appointId) {
          YZLocalStorage.setItem('appointment_latest_info', JSON.stringify({ appointId: params.appointId, startTime: parseDate(`${params.date} ${params.lessonTime.trim().split('-')[0]}`, 'YYYY-MM-DD HH:mm').getTime(), endTime: parseDate(`${params.date} ${params.lessonTime.trim().split('-')[1]}`, 'YYYY-MM-DD HH:mm').getTime() }));
        }
        const startTime = startOfWeek(params.date, { weekStartsOn: 1 });
        const endTime = addWeeks(startTime, 1);
        if (getOverLap(this.filterPanelData(), params, startTime.getTime(), endTime.getTime()) ||
         this.state.scheduleType === APPOINTMENT_SCHEDULE_TYPE.DAY) {
          this.setState({
            scheduleType: APPOINTMENT_SCHEDULE_TYPE.DAY,
            dateValue: params.date,
          }, () => this.updateKanbanData());
        } else {
          this.setState({
            weekStart: parseDate(params.date, 'YYYY-MM-DD'),
          }, () => this.updateKanbanData());
        }
      } });
  };

  getStartTimeLine = () => {
    const { timeRange, interval } = this.state;
    let startHour = Math.floor(timeRange[0] / 60);
    let startMinute = timeRange[0] - startHour * 60;

    if (startMinute % interval !== 0) {
      startMinute -= startMinute % interval;
    }

    return `${this.paddingTime(startHour)}:${this.paddingTime(startMinute)}`;
  }

  getEndTimeLine = () => {
    const { timeRange, interval } = this.state;
    let endHour = Math.floor(timeRange[1] / 60);
    let endMinute = timeRange[1] - endHour * 60;

    if (endMinute % interval !== 0) {
      endMinute = Math.ceil(endMinute / interval) * interval;
      if (endMinute % 60 === 0) {
        endHour += 1;
        endMinute = 0;
      }
    }

    return `${this.paddingTime(endHour)}:${this.paddingTime(endMinute)}`;
  }

  getFilterData = (filterData, startShowTime, endShowTime) => {
    if (!filterData) {
      return {};
    }
    const data = {};
    Object.keys(filterData).map(item => {
      if (filterData[item] && filterData[item].length) {
        data[item] = this.filterSettingsData(filterData[item], startShowTime, endShowTime);
      }
    });

    return data;
  }

  componentDidMount() {
    this.updateKanbanData();
    this.getTimeRangeConfig();
    YZLocalStorage.setItem('appointment_latest_info', null);
  }

  componentDidUpdate() {
    this.scrollToTime();
  }

  // debounceScrollHandler = debounce(this.handleScroll, 200);

  paddingTime(time) {
    return (time >= 10 ? '' : '0') + time;
  }

  render() {
    const {
      scheduleType,
      dateValue,
      dateRange,
      weekStart,
      loading,
      reserveStatus,
      appointmentNum,
      interval,
      filter,
    } = this.state;
    const startTime = scheduleType === APPOINTMENT_SCHEDULE_TYPE.DAY ? dateValue : weekStart;

    const startTimeLine = this.getStartTimeLine();
    const endTimeLine = this.getEndTimeLine();

    const filteredPanelData = this.filterPanelData();

    const startShowTime = getTimeLineStart(startTimeLine || '00:00', filteredPanelData, this.state.interval);
    const endShowTime = getTimeLineEnd(endTimeLine || '23:59', filteredPanelData, this.state.interval);
    const totalData = this.getFilterData(filteredPanelData, startShowTime, endShowTime);

    return (
      <div className="reserve-panel">
        <PanelHeader
          onTeacherChange={this.onTeacherChange.bind(this)}
          onCourseTypeChange={this.onCourseTypeChange.bind(this)}
          scheduleType={scheduleType}
          dateValue={dateValue}
          dateRange={dateRange}
          weekStart={weekStart}
          interval={interval}
          onChange={this.onChange}
          onSearch={this.onSearch}
          appointmentNum={appointmentNum}
          updateKanbanData={this.updateKanbanData}
          reserveStatus={reserveStatus}
          filterStatus={this.filterStatus}
          filter={filter}
        />
        <BlockLoading loading={loading}>
          <div className="appointment-panel-content">
            <Schedule
              type={scheduleType}
              data={totalData}
              max={2}
              rowHeight={120}
              interval={interval}
              ref={el => (this.scheduleEl = el)}
              current={new Date(startTime)}
              timeLineStart={startTimeLine}
              timelineEnd={endTimeLine}
              renderField={data => {
                return (
                  <PanelCell
                    appointment={{ ...data, studentLessonStatus: data.status }}
                    updateData={this.updateKanbanData}
                  />
                );
              }}
              renderWeekDays={date => {
                const data = filteredPanelData[formatDate(date, 'YYYY-MM-DD')] || [];
                return (
                  <WeekTitle
                    time={date}
                    count={(this.filterSettingsData(data, startShowTime, endShowTime)).length}
                    callback={() => PanelDayDialog.open({ defaultData: {
                      time: date,
                      timeLineStart: startShowTime,
                      timelineEnd: endShowTime,
                      data: data,
                    },
                    callback: () => {
                      this.updateKanbanData();
                    },
                    onCreateAppoint: (time) => {
                      this.openAppointmentDialog(time);
                    },
                    })}
                  />
                );
              }}
              dateCellRender={(data, date) => {
                // 月看板使用
              }}
              renderBackRow={time => {
                return <BackRow date={time} callback={() => this.openAppointmentDialog(time)} />;
              }}
            />
          </div>
        </BlockLoading>
        {/* <PanelFooter reserveStatus={reserveStatus} filterStatus={this.filterStatus} /> */}
      </div>
    );
  }
}
