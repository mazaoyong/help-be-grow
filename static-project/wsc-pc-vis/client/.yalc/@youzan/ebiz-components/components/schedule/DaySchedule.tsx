import React, { Component } from 'react';
import TimeLine from './Timeline';
import { getTimeLineList, getTimeLineStart, getTimeLineEnd } from './utils/timeline';
import sortData, { ISortData } from './utils/sortdata';
import BackRow from './BackRow';
import Columns from './Columns';
import './style/day-schedule.scss';

export type IDayScheduleProps = {
  type: 'day'; // 日
  current: Date;
  data: ISortData[];
  max?: number;
  rowHeight: number;
  interval: number; // timeline 时间间隔
  timeLineStart: string; // timeline 开始时间
  timeLineEnd: string; // timeline 结束时间
  renderField: (item: object) => JSX.Element;
  renderBackRow?: (time: Date) => JSX.Element;
  endDrag?: (startTime: number, endTime: number) => void;
};

export default class DaySchedule extends Component<IDayScheduleProps, {}> {
  static readonly defaultProps: Partial<IDayScheduleProps> = {
    rowHeight: 60,
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
    return getTimeLineStart(timeLineStart, data, interval);
  }

  get end() {
    const { timeLineEnd, interval, data } = this.props;
    return getTimeLineEnd(timeLineEnd, data, interval);
  }

  get data() {
    return sortData(this.props.data);
  }

  render() {
    const { interval, renderBackRow, renderField, max, current, rowHeight, endDrag } = this.props;

    return (
      <section className="ebiz-schedule__day">
        <div className="ebiz-schedule__day__content">
          <TimeLine data={this.timeline} interval={interval} rowHeight={rowHeight} />
          <div className="ebiz-schedule__day__panel">
            <BackRow
              data={this.timeline}
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
              date={current}
              data={this.data}
              max={max}
              timeLineStart={this.start}
              timeLineEnd={this.end}
              renderField={renderField}
            />
          </div>
        </div>
      </section>
    );
  }
}
