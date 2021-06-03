// 月视图 cell 渲染
import React, { FC, useContext, useRef, useEffect, useState } from 'react';
import cx from 'classnames';
import DetailPop from '../detail-pop';
import { format } from 'date-fns';
import { context, StateType, DispatchType } from '../../store';
import { openScheduleDayDialog } from '../schedule-day-dialog';
import { IViewCellData } from '../../types';
import './style.scss';
import { findDOMNode } from 'react-dom';

export interface IMonthCellProps {
  date: Date;
  data: IViewCellData[];
}

const getItemClass = (conflict: boolean, time: number) => {
  return cx({
    schedule__month__cell__item: true,
    conflict,
    deprecated: new Date().getTime() > time,
  });
};

export interface IMonthCellContentProps {
  data: IViewCellData;
  store: StateType;
  dispatch: DispatchType;
}

const MonthCellContent: FC<IMonthCellContentProps> = ({ data, store, dispatch }) => {
  return (
    <DetailPop key={data.lessonNo} data={data} store={store} dispatch={dispatch}>
      <div className={getItemClass(data.conflictResources !== '0', data.endTime)}>
        <p>{format(data.startTime, 'HH:mm') + ' ' + (data.className || data.eduCourseName)}</p>
      </div>
    </DetailPop>
  );
};

const MonthCell: FC<IMonthCellProps> = ({ date, data }) => {
  const { store, dispatch } = useContext(context);
  const [showData, setShowData] = useState<IViewCellData[]>([]);
  const [showmore, setShowmore] = useState(false);
  const [count, setCount] = useState(0);
  const detailRef = useRef(null);

  // 计算高度
  useEffect(() => {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = findDOMNode(detailRef.current) as HTMLElement;
    const height = dom.getBoundingClientRect().height;
    const count = Math.floor(height / 18) - 1;
    setCount(count);
  }, []);

  useEffect(() => {
    const sortData = [...data].sort((a, b) => a.startTime - b.startTime);

    if (data.length > count) {
      setShowData(sortData.slice(0, count));
      setShowmore(true);
    } else {
      setShowData(sortData);
      setShowmore(false);
    }
  }, [data, count]);

  return (
    <section className="schedule__month__cell" ref={detailRef}>
      {showData.map(v => {
        return <MonthCellContent key={v.lessonNo} data={v} store={store} dispatch={dispatch} />;
      })}
      {showmore && (
        <footer
          className="showmore"
          onClick={(e) => {
            e.stopPropagation();
            openScheduleDayDialog(date, data, store, dispatch);
          }}
        >
          还有{data.length - count}项
        </footer>
      )}
    </section>
  );
};

export default MonthCell;
