import React, { FC } from 'react';
import classnames from 'classnames';
import difference from 'date-fns/difference_in_calendar_days';
import addDays from 'date-fns/add_days';
import './style/backrow.scss';
import { DropTarget, DropTargetConnector, DropTargetMonitor, ConnectDropTarget } from 'react-dnd';
import DragEvent from './DragEvent';
import throttle from 'lodash/throttle';
import { format } from 'date-fns';

export interface IBackRowProps {
  data: number[] ;
  interval: number;
  rowHeight: number;
  index?: number;
  days?: number;
  renderBackRow?: (time: Date) => JSX.Element;
  hoverList?: number[];
  setHoverList?: Function;
  endDrag?: (startTime: number, endTime: number) => void;
}

export interface IBackViewRowProps {
  data: any[];
  resource: {
    resourceName: string;
    resourceId: string;
  };
  content?: any[];
  interval: number;
  rowHeight: number;
  renderBackRow?: (time: Date) => JSX.Element;
  renderField?: (item: object) => JSX.Element;
  days: any[];
}

export interface IBackViewCellProps {
  columnType: 'dimension' | 'content';
  interval: number;
  rowHeight: number;
  resource: {
    resourceName: string;
    resourceId: string;
  };
  content?: any[];
  renderBackRow?: (time: Date) => JSX.Element;
  renderField?: (item: object) => JSX.Element;
  day: string;
  data: any[];
}

export interface IDropProps {
  canDrop: boolean
  isOver: boolean
  connectDropTarget: ConnectDropTarget
}

export type IBackCellProps = IBackRowProps & IDropProps & {
  time: number;
  isHovered: boolean;
};

const daymilliseconds = 24 * 60 * 60 * 1000;

// 计算每一行的 class
const getRowClassName =
(time: number, interval: number, data: Array<number>, index: number, days: number, isHovered?: boolean) => {
  const now = new Date().getTime();
  let className = classnames({
    'ebiz-calendar__backrow__cell_before': time + interval * 60 * 1000 < now,
    'hovered': !!isHovered,
  }, 'ebiz-calendar__backrow__cell');

  // 日和周的当前时间基准线
  if (now > data[0] - daymilliseconds * index &&
    now < data[data.length - 1] + interval * 60 * 1000 + daymilliseconds * (days - index - 1)) {
    time = addDays(time, difference(now, time)).getTime();
  }

  if (time < now && now < time + interval * 60 * 1000) {
    className += '_now';
  }

  return className;
};

const BackCell: FC<IBackCellProps & IDropProps> =
({ time, data, days = 1, index = 0, interval, renderBackRow,
  rowHeight, connectDropTarget, isHovered, hoverList, setHoverList, endDrag }) => {
  return connectDropTarget(
    <div key={time} className={getRowClassName(time, interval, data, index, days, isHovered)} style={{ height: `${rowHeight}px` }}>
      <DragEvent endDrag={endDrag} hoverList={hoverList} setHoverList={setHoverList} name={time}>
        {renderBackRow && renderBackRow(new Date(time))}
      </DragEvent>
    </div>
  );
};

const BackCellWraper = DropTarget(
  'box',
  {
    drop: (props) => {
      return { name: props.time };
    },
    hover: throttle((props, monitor) => {
      const { hoverList, setHoverList } = props;
      const currentDragTime = monitor.getItem();
      if (!currentDragTime) {
        return;
      }
      if (!hoverList || !hoverList.length) {
        setHoverList([props.time]);
      }
      const sortableList = [...hoverList.sort()];
      if (props.time > currentDragTime.name) {
        setHoverList([
          currentDragTime.name,
          ...sortableList.filter((item: number) => item < props.time && item > currentDragTime.name),
          props.time,
        ]);
      } else if (props.time < currentDragTime.name) {
        setHoverList([
          props.time,
          ...sortableList.filter((item: number) => item < currentDragTime.name && item > props.time),
          currentDragTime.name,
        ]);
      } else {
        setHoverList([props.time]);
      }
    }, 250),
  },
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
)(BackCell);

const BackRow: FC<IBackRowProps> = (props) => {
  const { hoverList = [], setHoverList = () => {} } = props;
  const sortableList = hoverList.sort();
  return (
    <div className="ebiz-calendar__backrow">
      {props.data.map((time, index) => {
        const isHovered = !!hoverList.length && time >= sortableList[0] &&
         time <= sortableList[sortableList.length - 1];
        return <BackCellWraper
          key={`backcell-wrapper-${index}`}
          isHovered={isHovered}
          hoverList={hoverList}
          setHoverList={setHoverList}
          time={time}
          {...props}
        />;
      })}
    </div>
  );
};

export const BackViewRow: FC<IBackViewRowProps> = (props) => {
  const { data = [], days, ...restprops } = props;
  return (
    <div className="ebiz-calendar__backviewrow">
      <BackViewCell columnType='dimension' data={[]} day={''} {...restprops}/>
      {days.map(day => {
        const currentDate = format(day.date, 'YYYY-MM-DD');
        const filterData = data.filter(item => {
          return item.date === currentDate;
        });
        return <BackViewCell key={`ebiz-calendar__${currentDate}`} columnType='content' data={filterData} day={currentDate} {...restprops}/>;
      })}
    </div>
  );
};

const BackViewCell: FC<IBackViewCellProps> = (props) => {
  const { columnType, rowHeight, renderField, data, resource, day } = props;
  return (
    <div className='ebiz-calendar__backviewrow__cell_before ebiz-calendar__backviewrow__cell ebiz-calendar__backviewrow__column' style={{ minHeight: `${rowHeight}px` }}>
      {columnType === 'content' ? renderField ? renderField({
        data,
        day,
        resource,
      }) : '' : <div className='ebiz-calendar__columnstart'>{resource.resourceName}</div>}
    </div>
  );
};

export default BackRow;
