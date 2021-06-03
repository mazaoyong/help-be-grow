import React, { FC, useLayoutEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Schedule } from '@youzan/ebiz-components';
import formatDate from 'zan-utils/date/formatDate';
import { IViewCellData } from '../../types';
import { StateType, DispatchType } from '../../store';
import ScheduleField from '../field';
import { getHourPlusMinuteFromTime, parseHourPlusMinute2String } from '../schedule/timeline';
import BackRow from '../backrow';

export interface IPanelDayPanelProps {
  defaultData: IViewCellData[];
  time: Date;
  callback: ()=>void;
  closeDialog?: ()=>void;
  store: StateType;
  dispatch: DispatchType;
  timeLineStart: number;
  timelineEnd: number;
};

const PanleDayDialogContent: FC<IPanelDayPanelProps> = (props) => {
  const { defaultData, time, store, dispatch, timeLineStart, timelineEnd, closeDialog } = props;

  const scheduleEl = useRef(null);
  useLayoutEffect(() => {
    // const { panelData, scheduleType } = this.state;
    if (!defaultData || !defaultData.length) {
      return;
    }
    const sortData = [...defaultData];
    sortData.sort((time1, time2) => {
      return time1.startTime - time2.startTime;
    });

    // const startTime = new Date(sortData[0].startTime);
    if (sortData[0] && sortData[0].startTime) {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(scheduleEl.current) as HTMLElement;
      const $day = node.getElementsByClassName('ebiz-schedule__day')[0];
      if ($day && 'scrollBehavior' in document.documentElement.style) {
        const panelStartTime: number = getHourPlusMinuteFromTime(sortData[0].startTime);

        $day.scrollTo({
          top: ((panelStartTime - timeLineStart) / 60) * 60, // 每 15 分钟高度为 50 px
        });
      }
    }
  }, [defaultData]);

  return (
    <div className="panel-day-dialog-content">
      <Schedule
        type={'day'}
        data={{ [formatDate(time, 'YYYY-MM-DD')]: defaultData }}
        max={2}
        interval={60}
        current={new Date(time)}
        ref={scheduleEl}
        timeLineStart={parseHourPlusMinute2String(timeLineStart) || '00:00'}
        timelineEnd={parseHourPlusMinute2String(timelineEnd) || '23:59'}
        renderBackRow={time => {
          return <BackRow isInDialog closeDialog={closeDialog} store={store} dispatch={dispatch} date={time} />;
        }}
        renderField={(data) => {
          return (
            <ScheduleField
              isInDialog
              closeDialog={closeDialog}
              data={data as IViewCellData}
              store={store}
              dispatch={dispatch} />
          );
        }}
      />
    </div>
  );
};

export default PanleDayDialogContent;
