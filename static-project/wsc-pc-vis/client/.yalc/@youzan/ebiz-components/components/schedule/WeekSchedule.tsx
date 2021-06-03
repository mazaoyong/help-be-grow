import React, { Component } from 'react';
import TimeLine from './Timeline';
import BackRow, { BackViewRow } from './BackRow';
import sortData, { ISortData } from './utils/sortdata';
import { getTimeLineList, getTimeLineStart, getTimeLineEnd } from './utils/timeline';
import { calendar } from '@youzan/zan-media-sdk';
import { format } from 'date-fns';
import './style/week-schedule.scss';
import Columns from './Columns';

// const ViewWords = [];

export enum ViewWords {
  timeline = '时间',
  teacher = '老师',
  classroom = '教室',
  class = '班级'
}

export type IWeekScheduleProps = {
  type: 'week';
  max?: number;
  current: Date;
  data: {
    [key: string]: ISortData[];
  };
  // 每周开始的日期，0-7，默认为1，从周一开始
  weekStartsOn?: number;
  interval: number; // timeline 时间间隔
  rowHeight: number;
  timeLineStart: string; // timeline 开始时间
  timeLineEnd: string; // timeline 结束时间
  view?: 'timeline' | 'teacher' | 'classroom' | 'class' // 看板视图选择
  renderWeekDays?: (date: Date) => JSX.Element; // 头部单元格
  renderField: (item: object) => JSX.Element;
  renderBackRow?: (time: Date) => JSX.Element;
  endDrag?: (startTime: number, endTime: number) => void;
  onShowMoreClick?: (date: Date) => void;
};

class WeekSchedule extends Component<IWeekScheduleProps, {}> {
  static readonly defaultProps: Partial<IWeekScheduleProps> = {
    rowHeight: 60,
    weekStartsOn: 1,
    timeLineStart: '00:00',
    timeLineEnd: '24:00',
    interval: 15,
  };

  state = {
    hoverList: [],
  }

  get timeline() {
    const { current, interval } = this.props;

    const { start, end } = this;
    return getTimeLineList(start, end, interval).map(t => {
      return current.setHours(0, 0, 0, 0) + t * 60 * 1000;
    });
  }

  get start() {
    const { timeLineStart, interval, data } = this.props;
    let allData: ISortData[] = [];
    for (let v in data) {
      allData = allData.concat(data[v]);
    }
    return getTimeLineStart(timeLineStart, allData, interval);
  }

  get end() {
    const { timeLineEnd, interval, data } = this.props;
    let allData: ISortData[] = [];
    for (let v in data) {
      allData = allData.concat(data[v]);
    }
    return getTimeLineEnd(timeLineEnd, allData, interval);
  }

  getTimeline(day: Date) {
    const { interval } = this.props;
    return getTimeLineList(this.start, this.end, interval).map(t => {
      return day.setHours(0, 0, 0, 0) + t * 60 * 1000;
    });
  }

  get weeks() {
    const { current, weekStartsOn } = this.props;
    return calendar.getWeekDays(current, weekStartsOn);
  }

  get data() {
    const { data, view } = this.props;
    if (view !== 'timeline') {
      return data;
    }

    const tmp: any = {};

    for (let v in data) {
      tmp[v] = sortData(data[v]);
    }
    return tmp;
  }

  getViewsBody() {
    const {
      interval,
      renderBackRow,
      rowHeight,
      view,
      renderField,
    } = this.props;
    if (!view) {
      return null;
    }

    return <div className="ebiz-schedule__week__content" style={{ flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      {
        Object.keys(this.data).map(item => {
          const { data = [], ...rest } = this.data[item] || {};
          return <div key={`ebiz-schedule_${item}`} className="ebiz-schedule__week__content__viewday">
            <BackViewRow
              data={data}
              resource={{ resourceId: item, ...rest }}
              days={this.weeks}
              interval={interval}
              rowHeight={rowHeight}
              renderBackRow={renderBackRow}
              renderField={renderField}
            />
          </div>;
        })
      }
      {(!this.data || !Object.keys(this.data).length) && <div className='schedule_empty_words'>暂无{ViewWords[view]}</div>}
    </div>;
  }

  getTimelineBody() {
    const {
      interval,
      max,
      renderField,
      renderBackRow,
      onShowMoreClick,
      rowHeight,
      endDrag,
    } = this.props;

    return <>
      <TimeLine data={this.timeline} interval={interval} rowHeight={rowHeight} days={this.weeks.length} />
      <div className="ebiz-schedule__week__content">
        {this.weeks.map((day, index) => {
          return (
            <div
              className="ebiz-schedule__week__content__day"
              key={day.date.toString()}
            >
              <BackRow
                data={this.getTimeline(new Date(day.date))}
                index={index}
                days={this.weeks.length}
                interval={interval}
                rowHeight={rowHeight}
                renderBackRow={renderBackRow}
                hoverList={this.state.hoverList}
                endDrag={endDrag}
                setHoverList={(list: number[]) => {
                  this.setState({ hoverList: list });
                }}
              />
              <Columns
                data={this.data[format(day.date, 'YYYY-MM-DD')] || []}
                date={day.date}
                max={max}
                timeLineStart={this.start}
                timeLineEnd={this.end}
                renderField={renderField}
                onShowMoreClick={onShowMoreClick}
              />
            </div>
          );
        })}
      </div>
    </>;
  }

  render() {
    const {
      renderWeekDays,
      view,
    } = this.props;

    return (
      <div className="ebiz-schedule__week">
        <div className="ebiz-schedule__week__header" style={{ paddingLeft: view !== 'timeline' ? '0' : '50px' }}>
          {view !== 'timeline' && <div
            className="ebiz-schedule__week__header__cellstart"
          >
            <div className="ebiz-schedule__week__header__viewstart">{ViewWords[view || 'teacher'] || ''}</div>
          </div>}
          {this.weeks.map(day => {
            return (
              <div
                key={day.date.toString()}
                className="ebiz-schedule__week__header__cell"
              >
                {renderWeekDays
                  ? renderWeekDays(day.date)
                  : `周${day.week}(${format(day.date, 'M-DD')})`}
              </div>
            );
          })}
        </div>
        <section className="ebiz-schedule__week__panel__wrap">
          <div className="ebiz-schedule__week__panel" >
            {view === 'timeline' && this.getTimelineBody()}
            {view !== 'timeline' && this.getViewsBody() }
          </div>
        </section>
      </div>
    );
  }
}

export default WeekSchedule;
