import React, { FC, useCallback, useMemo } from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { LinkButton } from '@youzan/react-components';
import { IEasyGridColumn, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import fen2yuan from 'fns/fen2yuan';
import { RewardTypeEnum, ActivityTypeEnum } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import { POINTS_NAME } from 'pages/ump/referral/constants';
import RewardRecordDialog from '@ability-center/ump/reward-record';
import { IRecommendRankDTO } from '../../../types';
import { showUser } from '../../constants';

import { findRankDataByPage } from '../../../api/stats';

const PAGE_SIZE = 10;

const { List, EasyGrid } = EasyList;

interface IReferrerRankingProps {
  id: string;
}

const ReferrerRanking: FC<IReferrerRankingProps> = (props) => {
  const { id } = props;

  const referrerColumns: IEasyGridColumn<IRecommendRankDTO>[] = useMemo(
    () => [
      {
        title: '名次',
        name: 'rankNo',
      },
      {
        title: '推荐人',
        name: 'oldCustomerName',
        bodyRender: (data) => {
          return showUser(data.oldCustomerId, data.oldCustomerName, data.oldCustomerPhone);
        },
      },
      {
        title: '推荐人数',
        name: 'recommendCount',
      },
      {
        title: '带来的订单数',
        name: 'orderCount',
      },
      {
        title: '佣金奖励（元）',
        textAlign: 'right',
        bodyRender: (data) => {
          return fen2yuan(data.totalRewardValue);
        },
      },
      {
        title: `${POINTS_NAME}奖励`,
        bodyRender: (data) => {
          const { totalBonusPoint } = data;
          return totalBonusPoint || '-';
        },
      },
      {
        title: '优惠券奖励',
        bodyRender: (data) => {
          const { couponCount, oldCustomerId, oldCustomerName, oldCustomerPhone } = data;
          return couponCount
            ? <LinkButton
              onClick={() => {
                RewardRecordDialog({
                  userId: oldCustomerId,
                  userName: oldCustomerName,
                  userPhone: oldCustomerPhone,
                  userLabel: '推荐人',
                  activityId: Number(id),
                  rewardType: RewardTypeEnum.COUPON,
                  activityType: ActivityTypeEnum.RECOMMENT
                });
              }}
            >
              {couponCount}
            </LinkButton>
            : <span>-</span>;
        },
      },
      {
        title: '赠品奖励',
        bodyRender: (data) => {
          const { presentCount, oldCustomerId, oldCustomerName, oldCustomerPhone } = data;
          return presentCount
            ? <LinkButton
              onClick={() => {
                RewardRecordDialog({
                  userId: oldCustomerId,
                  userName: oldCustomerName,
                  userPhone: oldCustomerPhone,
                  userLabel: '推荐人',
                  activityId: Number(id),
                  rewardType: RewardTypeEnum.PRESENT,
                  activityType: ActivityTypeEnum.RECOMMENT
                });
              }}
            >
              {presentCount}
            </LinkButton>
            : <span>-</span>;
        },
      },
    ],
    [id],
  );

  const fetchData = useCallback(
    (query): Promise<IFormatData> => {
      const { page = 1, pageSize } = query;
      return findRankDataByPage({ page, pageSize, activityId: id })
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
          throw Notify.error(e || '拉取推荐人排行数据失败，请稍后重试');
        });
    },
    [id],
  );

  return (
    <div className="referral-stats__referrer-ranking">
      <h1>推荐人排行榜</h1>
      <List mode="none" onSubmit={fetchData} defaultFilter={{ pageSize: PAGE_SIZE }}>
        <EasyGrid rowKey="rankNo" columns={referrerColumns} emptyLabel={<span>暂无数据</span>} />
      </List>
    </div>
  );
};

export default ReferrerRanking;
