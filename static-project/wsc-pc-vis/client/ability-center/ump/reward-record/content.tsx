import React, { FC, useCallback, useMemo } from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { IFormatData, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import formatDate from 'zan-utils/date/formatDate';
import {
  RewardTypeEnum,
  IRewardRecordLogDTO,
  ActivityTypeEnum,
  RewardStatusMap
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import { desensitivePhone } from 'fns/text/caculate';
import { DateFormat } from './constants';
import { findRewardDetail } from './api';

import './index.scss';

const { List, EasyGrid } = EasyList;

export interface IRewardRecordProps {
  userId: number;
  userName: string;
  userPhone: string;
  userLabel: string;
  activityId: number;
  activityType: ActivityTypeEnum;
  rewardType: RewardTypeEnum;
}

const RewardRecord: FC<IRewardRecordProps> = ({
  userId,
  userName = '',
  userPhone = '',
  userLabel = '',
  activityId,
  activityType,
  rewardType,
}) => {
  const columns: IEasyGridColumn<IRewardRecordLogDTO>[] = useMemo(
    () => [
      {
        title: '奖励内容',
        bodyRender: (data) => {
          const url =
            window._global.url.v4 +
            (rewardType === RewardTypeEnum.COUPON ? '/ump/coupon/list' : '/ump/present');

          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {data.name}
            </a>
          );
        },
      },
      {
        title: '发放时间',
        bodyRender: (data) => {
          return <span>{data.rewardTime ? formatDate(data.rewardTime, DateFormat) : '-'}</span>;
        },
      },
      {
        title: '奖励发放',
        bodyRender: (data) => {
          const { rewardStatus, failReason } = data;
          return (
            <div className="referral__reward-record-status">
              <div>{RewardStatusMap[rewardStatus]}</div>
              <div className="reward-reason">{failReason}</div>
            </div>
          );
        },
      },
    ],
    [rewardType],
  );

  const fetchData = useCallback(
    (query): Promise<IFormatData> => {
      const { page = 1, pageSize } = query;
      return findRewardDetail({
        page,
        pageSize,
        activityId,
        userId,
        rewardType,
        activityType
      })
        .then((res) => {
          const { content, total } = res;
          return {
            dataset: content,
            pageInfo: {
              total,
              page,
            },
          };
        })
        .catch((e) => {
          throw Notify.error(e || '获取奖励详情数据失败，请稍后重试');
        });
    },
    [activityId, activityType, rewardType, userId],
  );

  return (
    <div className="reward-record">
      <div className="user-info">
        {userLabel}：{userName} {desensitivePhone(userPhone)}
      </div>
      <List mode="none" onSubmit={fetchData} defaultFilter={{ pageSize: 5 }}>
        <EasyGrid rowKey="id" columns={columns} emptyLabel={<span>暂无数据</span>} />
      </List>
    </div>
  );
};

export default RewardRecord;
