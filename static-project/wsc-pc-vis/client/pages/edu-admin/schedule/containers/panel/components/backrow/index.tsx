import React, { FC } from 'react';
import { Notify } from 'zent';
import { withRouter, WithRouterProps } from 'react-router';
import { MouseFollow } from '@youzan/ebiz-components';
import { has, get } from 'lodash';
import './style.scss';
// import { isBefore } from 'date-fns';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import { checkAccess } from '@youzan/sam-components';
import GotoPage from '../schedule/gotopage';
import { IProviderProps, DispatchType } from '../../store';
import travel from '@youzan/utils/date/travel';

export interface IBackRowProps {
  date: Date;
  store: IProviderProps['state'];
  dispatch: DispatchType;
  isInDialog?: boolean;
  closeDialog?: () => void;
}

const BackRow: FC<IBackRowProps & WithRouterProps> =
({ date, store, dispatch, router, isInDialog = false, closeDialog = () => {} }) => {
  const startTime = new Date(date).getTime();
  const isBeforeForbid = new Date(date) < travel(-90, new Date(), 'day'); // 无法创建90天之前的日程
  return (
    <MouseFollow
      popContent={<div className="schedule__backrow__pop">{isBeforeForbid ? '不允许操作90天以前的日程' : '点击新建日程'}</div>}
      position="TopRight"
      cushion={{ top: -5 }}
    >
      <div
        className="schedule__backrow__content"
        onClick={isBeforeForbid ? () => {} : () => {
          let query: any = {
            startTime,
            endTime: startTime + (store.interval - 1) * 60 * 1000,
          };
          let kdtId = window._global.kdtId || '';
          if (/educlass/.test(location.pathname)) {
            if (has(router, 'params.eduClassId') && has(router, 'params.eduCourseId')) {
              query.eduCourseId = get(router, 'params.eduCourseId');
              query.classNo = get(router, 'params.classNo');
              kdtId = get(router, 'params.kdtId');
            }
          }

          if (checkAccess('编辑')) {
            ScheduleNewDialog.open('新建日程', {
              query,
              kdtId,
              afterSaveSucceed: (submitData: any, scheduleId: string) => {
                if (isInDialog && closeDialog) {
                  closeDialog();
                }
                GotoPage(submitData, store, dispatch, scheduleId);
                // getScheduleData({ startTime, pageNumber: 1, scheduleType }, store, dispatch, store.activeId);
              },
            });
          } else {
            Notify.error('没有足够的权限进行该操作');
          }
        }}
      />
    </MouseFollow>
  );
};

export default withRouter(BackRow);
