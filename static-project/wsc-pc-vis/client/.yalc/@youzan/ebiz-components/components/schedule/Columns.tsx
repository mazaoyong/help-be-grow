import React, { FC, CSSProperties, Fragment } from 'react';
import { ISortData } from './utils/sortdata';
//  import MouseFollow from '@youzan/ebiz-mouse-follow';
import calcDurationPercent from './utils/calcdurationpercent';
import './style/columns.scss';

type renderFieldType = (item: object) => JSX.Element;

export interface IColumnsProps {
  max?: number;
  date: Date;
  data: any; // ISortData[][];
  renderField: renderFieldType;
  timeLineStart: String;
  timeLineEnd: String;
  onShowMoreClick?: (date: Date) => void;
}

export interface IColumnProps {
  data: any // ISortData[];
  renderField: renderFieldType;
  timeLineStart: String;
  timeLineEnd: String;
}

const Column: FC<IColumnProps> = ({ data, renderField, timeLineStart, timeLineEnd }) => {
  const FieldList: Array<ISortData> = [];
  const SingleFieldList: Array<ISortData> = []; // 无重叠时间的课程占据100%宽度
  const [hour, minute] = timeLineStart.split(':');
  const [endhour, endminute] = timeLineEnd.split(':');
  data.map((item: ISortData) => {
    const low = new Date(item.startTime).setHours(+hour, +minute, 0, 0); // 起始时间点
    const top = new Date(item.startTime).setHours(+endhour, +endminute);
    const duration = top - low;

    const style: CSSProperties = {
      top: `${calcDurationPercent(item.startTime, low, duration) * 100}%`,
      height: `${calcDurationPercent(item.startTime, item.endTime, duration) * 100}%`,
      width: '100%',
    };

    if (item.startTime >= low) {
      (item.overlap ? FieldList : SingleFieldList).push({ ...item, style });
    }
  });

  return (
    <Fragment>
      <div className="ebiz-schedule__column">
        {
          FieldList.map(item => {
            return (
              <div
                key={item.startTime}
                className="ebiz-schedule__column__field"
                style={item.style}
              >
                {renderField(item)}
              </div>
            );
          })
        }
      </div>
      {
        SingleFieldList.map(item => {
          return (
            <div
              key={item.startTime}
              className="ebiz-schedule__column__field"
              style={item.style}
            >
              {renderField(item)}
            </div>
          );
        })
      }
    </Fragment>
  );
};

const Columns: FC<IColumnsProps> = ({
  max = Infinity,
  data,
  renderField,
  timeLineStart,
  timeLineEnd,
}) => {
  // let showMore = false;

  if (max < data.length) {
    // showMore = true;
    data.splice(max);
  }

  return (
    <div className="ebiz-schedule__columns">
      {data.map((items: any, i: string | number | undefined) => {
        return <Column
          key={i} data={items} renderField={renderField} timeLineStart={timeLineStart} timeLineEnd={timeLineEnd} />;
      })}
      {/* {showMore && (
        <MouseFollow
          popContent={
            <div className="ebiz-schedule__columns__showmore__pop">
              点击查看更多
            </div>
          }
          position="TopRight"
        >
          <div
            className="ebiz-schedule__columns__showmore"
            onClick={() => onShowMoreClick && onShowMoreClick(date)}
          >
            <p>更多</p>
          </div>
        </MouseFollow>
      )} */}
    </div>
  );
};

export default Columns;
