// 日看板弹窗
import React, { FC } from 'react';
import { Dialog } from 'zent';
import { Schedule } from '@youzan/ebiz-components';
import ScheduleField from '../field';
import { format } from 'date-fns';
import BackRow from '../backrow';
import { IViewCellData, IViewData } from '../../types';
import './style.scss';
import { StateType, DispatchType } from '../../store';

interface IScheduleDayDialogProps {
  data: IViewCellData[];
  date: Date;
  store: StateType;
  dispatch: DispatchType;
}

export const ScheduleDayDialogID = 'ScheduleDayDialogID';

const { openDialog } = Dialog;

const ScheduleDayDialog: FC<IScheduleDayDialogProps> = ({ data, date, store, dispatch }) => {
  const scheduleData: IViewData = { [format(date, 'YYYY-MM-DD')]: data };

  return (
    <section className="schedule__day__dialog">
      <Schedule
        type="day"
        data={scheduleData}
        interval={60}
        rowHeight={120}
        current={date}
        renderField={data => {
          return <ScheduleField data={data as IViewCellData} store={store} dispatch={dispatch} />;
        }}
        renderBackRow={time => {
          return <BackRow store={store} dispatch={dispatch} date={time} />;
        }}
      />
    </section>
  );
};

export const openScheduleDayDialog = (
  date: Date,
  data: IViewCellData[],
  store: StateType,
  dispatch: DispatchType,
) => {
  openDialog({
    dialogId: ScheduleDayDialogID,
    title: `${format(date, 'YYYY-MM-DD')}`,
    children: <ScheduleDayDialog date={date} data={data} store={store} dispatch={dispatch} />,
    style: {
      width: '70vw',
      height: '80vh',
    },
  });
};

export default ScheduleDayDialog;
