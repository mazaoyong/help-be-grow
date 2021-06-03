import React, { FC, useState, MouseEventHandler } from 'react';
import DetailPop from '../detail-pop';
import { StateType, DispatchType } from '../../store';
import { MouseFollow } from '@youzan/ebiz-components';
import { format } from 'date-fns';
import travel from '@youzan/utils/date/travel';

export interface IResourceProps {
  store: StateType;
  dispatch: DispatchType;
  filterData: any;
  onFieldClick: (day: string, resource: { [index: string]: any }) => void;
}

const ResourceField: FC<IResourceProps> = (props) => {
  const [position, setPosition] = useState({ top: 0 });
  const { store, dispatch, filterData, onFieldClick } = props;
  // const isBeforeToday: boolean = isBefore(filterData.day, startOfDay(new Date()));
  const onMouseEnter: MouseEventHandler = e => {
    setPosition({
      top: e.pageY,
    });
  };

  const isBeforeForbid = filterData.day && new Date(`${filterData.day} 00:00:00`) < travel(-90, new Date(), 'day'); // 无法创建90天之前的日程
  return <MouseFollow
    popContent={<div className="schedule__view__pop">{isBeforeForbid ? '不允许操作90天以前的日程' : '点击新建日程'}</div>}
    position="TopRight"
    cushion={{ top: -5 }}
  >
    <div className='resource-field-wrapper' onClick={isBeforeForbid ? () => {} : () => onFieldClick(filterData.day, filterData.resource)}>
      {filterData.data.map((item, index) => {
        const educourseName = item.className || item.eduCourseName;
        const date = format(item.startTime, 'HH:mm');
        const state = new Date().getTime() > item.endTime ? 'deprecated' : item.conflictResources !== '0' ? 'conflict' : 'enabled';

        return <DetailPop key={index} data={item} store={store} dispatch={dispatch} position={position}>
          <div className='resource-field' onMouseEnter={onMouseEnter}>
            <div className={`resource-field-${state}`} >
              <div className={`resource-field-${state}-circle`}></div>
            </div>
            <div className={`resource-field-course ${state === 'deprecated' ? 'deprecated' : ''}`}>{educourseName}</div>
            <div className="resource-field-datetime">{date}</div>
          </div>
        </DetailPop>;
      })}
    </div>
  </MouseFollow>;
};

export default ResourceField;
