import React, { Component } from 'react';
import { ISortData } from './utils/sortdata';
import CalendarModule from '../calendar';
import { format } from 'date-fns';
import './style/month-schedule.scss';

const { CalendarPanel } = CalendarModule;

export interface IMonthScheduleProps {
  type: 'month';
  current: Date;
  data: {
    [key: string]: ISortData[];
  };
  // 每周开始的日期，0-7，默认为1，从周一开始
  weekStartsOn?: number;
  // 月份变化触发事件
  onMonthChange?: (date: Date) => void;
  // 自定义渲染日期单元格，返回内容会被追加到单元格，日期下面
  dateCellRender?: (data: ISortData[], date: Date) => JSX.Element;
  // 自定义渲染日期单元格，返回内容覆盖单元格
  dateFullCellRender?: (data: ISortData[], date: Date) => JSX.Element;
  // 点击日期的回调
  onSelect?: (date: Date) => void;
}

export default class MonthSchedule extends Component<IMonthScheduleProps, {}> {
  dateCellRender = (date: Date) => {
    const { data, dateCellRender, dateFullCellRender } = this.props;
    if (dateCellRender && !dateFullCellRender) {
      const dayDate = data[format(date, 'YYYY-MM-DD')] || [];
      return dateCellRender(dayDate, date);
    }
    return <p />;
  };

  dateFullCellRender = (date: Date) => {
    const { data, dateFullCellRender } = this.props;
    if (dateFullCellRender) {
      const dayDate = data[format(date, 'YYYY-MM-DD')] || [];
      return dateFullCellRender(dayDate, date);
    }
    return <p />;
  };

  render() {
    const {
      current,
      weekStartsOn,
      onMonthChange,
      onSelect,
      dateCellRender,
      dateFullCellRender,
    } = this.props;

    return (
      <div className="ebiz-schedule__month">
        <CalendarPanel
          weekStartsOn={weekStartsOn}
          current={current}
          onMonthChange={onMonthChange}
          onSelect={onSelect}
          dateCellRender={dateCellRender ? this.dateCellRender : undefined}
          dateFullCellRender={
            dateFullCellRender ? this.dateFullCellRender : undefined
          }
        />
      </div>
    );
  }
}
