import React, { FC, useEffect, useState, useCallback } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Tag } from 'zent';
import { date, money } from '@youzan/utils';
import { statusLabel } from '../../../../constants';
import { ActivityStatus } from '../../../../types';
import { getSummary } from '../../../../api';
import { dashboardItemLabel } from './constants';

import './index.scss';

const { openDialog, DialogBody } = Dialog;

interface IDashboardItem {
  type: string;
  count: number;
}

interface IDashboardDetail {
  list: IDashboardItem[];
}

interface IDialogProps {
  data: {
    activityId: number;
    endAt: number;
    startAt: number;
    status: number;
    title: string;
  };
}

const DialogContent: FC<IDialogProps> = ({ data: { activityId, startAt, endAt, status, title } }) => {
  const prefixcls = 'activity-data';
  const [dashboard, setDashboard] = useState<IDashboardDetail>({
    list: [],
  });
  const getDashboard = useCallback(() => {
    if (activityId) {
      getSummary({
        id: activityId,
      }).then(res => {
        const { couponNum, giftNum, newStudentJoinNum, oldStudentJoinNum, pointNum, pv, uv } = res;
        setDashboard({
          list: [
            {
              type: 'pv',
              count: pv,
            },
            {
              type: 'uv',
              count: uv,
            },
            {
              type: 'oldStudentJoinNum',
              count: oldStudentJoinNum,
            },
            {
              type: 'newStudentJoinNum',
              count: newStudentJoinNum,
            },
            {
              type: 'pointNum',
              count: pointNum,
            },
            {
              type: 'couponNum',
              count: couponNum,
            },
            {
              type: 'giftNum',
              count: giftNum,
            },
          ],
        });
      });
    }
  }, [activityId]);
  useEffect(() => {
    getDashboard();
  }, [getDashboard]);
  return (
    <>
      <DialogBody>
        <div className={prefixcls}>
          <div className={`${prefixcls}-top`}>
            <div className={`${prefixcls}-top-title`}>
              {title}
              <Tag theme={status === ActivityStatus.ongoing ? 'green' : 'grey'} className={`${prefixcls}-top-status`} outline>
                {statusLabel[status]}
              </Tag>
            </div>
            <div className={`${prefixcls}-top-time`}>
              活动时间：{date.makeDateTimeStr(startAt)} 至 {date.makeDateTimeStr(endAt)}
            </div>
          </div>
          <div className={`${prefixcls}-main`}>
            {dashboard.list.map(item => {
              return (
                <div key={item.type} className={`${prefixcls}-main-item`}>
                  <div className={`${prefixcls}-main-item-label`}>
                    {dashboardItemLabel[item.type]}
                  </div>
                  <div className={`${prefixcls}-main-item-count`}>
                    {money.formatLargeNumber(item.count)}
                  </div>
                </div>
              );
            })}
            <div className={`${prefixcls}-main-item`}></div>
          </div>
          <div className={`${prefixcls}-bottom`}>
            数据统计至 {date.makeDateTimeStr(Date.now() > endAt ? endAt : Date.now())}
          </div>
        </div>
      </DialogBody>
    </>
  );
};

const ActivityDataDialog = ({ activityId, endAt, startAt, status, title }) => {
  openDialog(DialogContent, {
    data: {
      activityId,
      endAt,
      startAt,
      status,
      title
    },
    title: '活动数据',
    mask: true,
  });
};

export default ActivityDataDialog;
