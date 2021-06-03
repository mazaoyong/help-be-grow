import React, { Component } from 'react';
import { ISortData } from './utils/sortdata';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MonthSchedule from './MonthSchedule';
import WeekSchedule from './WeekSchedule';
import DaySchedule from './DaySchedule';
import { format } from 'date-fns';
import './style/schedule.scss';

export interface ScheduleProps {
  type: 'day' | 'week' | 'month';
  current: Date;
  data: {
    [key: string]: ISortData[];
  };
  rowHeight?: number;
  max?: number;
  interval?: number; // timeline 时间间隔
  timeLineStart?: string; // timeline 开始时间
  timelineEnd?: string; // timeline 结束时间
  view?: 'timeline' | 'teacher' | 'classroom' | 'class'; // 看板视图选择
  renderField: (item: any) => JSX.Element;
  // 每周开始的日期，0-7，默认为1，从周一开始
  weekStartsOn?: number;
  // 月份变化触发事件
  onMonthChange?: (date: Date) => void;
  // 自定义渲染日期单元格，返回内容会被追加到单元格，日期下面
  dateCellRender?: (data: ISortData[], date: Date) => JSX.Element;
  // 自定义渲染日期单元格，返回内容覆盖单元格
  dateFullCellRender?: (data: ISortData[], date: Date) => JSX.Element;
  // 渲染背景
  renderBackRow?: (time: Date) => JSX.Element;
  // 点击日期的回调
  onSelect?: (date: Date) => void;
  onShowMoreClick?: (date: Date) => void;
  renderWeekDays?: (date: Date) => JSX.Element; // 周看板头部单元格
  endDrag?: (startTime: number, endTime: number) => void;
}

export default class Schedule extends Component<ScheduleProps, {}> {
  renderMonth() {
    const {
      current,
      weekStartsOn,
      data,
      dateCellRender,
      dateFullCellRender,
      onSelect,
    } = this.props;

    return (
      <MonthSchedule
        type="month"
        current={current}
        weekStartsOn={weekStartsOn}
        data={data}
        dateCellRender={dateCellRender}
        dateFullCellRender={dateFullCellRender}
        onSelect={onSelect}
      />
    );
  }

  renderWeek() {
    const {
      data,
      current,
      weekStartsOn,
      timeLineStart,
      timelineEnd,
      interval,
      rowHeight,
      max,
      renderField,
      renderBackRow,
      onShowMoreClick,
      renderWeekDays,
      view = 'timeline',
      endDrag,
    } = this.props;

    return (
      <WeekSchedule
        type="week"
        view={view}
        data={data}
        current={current}
        weekStartsOn={weekStartsOn}
        timeLineStart={timeLineStart}
        timeLineEnd={timelineEnd}
        interval={interval}
        rowHeight={rowHeight}
        max={max}
        renderWeekDays={renderWeekDays}
        renderField={renderField}
        renderBackRow={renderBackRow}
        onShowMoreClick={onShowMoreClick}
        endDrag={endDrag}
      />
    );
  }

  renderDay() {
    const {
      data,
      current,
      timeLineStart,
      timelineEnd,
      interval,
      rowHeight,
      renderField,
      renderBackRow,
      endDrag,
    } = this.props;

    const dayData = data[format(current, 'YYYY-MM-DD')] || [];

    return (
      <DaySchedule
        type="day"
        data={dayData}
        current={current}
        rowHeight={rowHeight}
        timeLineStart={timeLineStart}
        timeLineEnd={timelineEnd}
        interval={interval}
        renderField={renderField}
        renderBackRow={renderBackRow}
        endDrag={endDrag}
      />
    );
  }

  render() {
    const { type } = this.props;

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="ebiz-schedule">
          {type === 'day' && this.renderDay()}
          {type === 'week' && this.renderWeek()}
          {type === 'month' && this.renderMonth()}
        </div>
      </DndProvider>
    );
  }
}
