import React, { FC, useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { Notify } from 'zent';
import { BlankLink, LinkButton } from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';
import { StudentDetailLink } from '@ability-center/student';
import RewardRecordDialog from '@ability-center/ump/reward-record';
import {
  RewardTypeEnum,
  ActivityTypeEnum,
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import { ActivityBanner, ActivityBannerData } from '../../components/activity-banner';
import { EmptyListTips } from '../../components/empty-list-tips';
import { findPromotionList, getDetail } from '../../api';
import { ClueStates } from '../../types';
import { log } from '../../utils/logger';
import { getAbilitys } from '../../utils';

import { IEasyGridColumn, IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import './style.scss';

const { List, EasyGrid, Search } = EasyList;

interface OldStudentsProps {
  params: {
    id: string;
  };
}

interface NewStudentsLinkProps {
  id: string;
  num: number;
  oldStudentName: string;
  newStudentState: ClueStates;
}

interface OldStudentsListData {
  /** 已成交 */
  dealNum: number;
  /** 已试听 */
  followingNum: number;
  /** 待跟进 */
  toFollowNum: number;
  /** 转介绍新学员数 */
  newStudentTotalNum: number;
  /** 老学员id */
  oldStudentId: number;
  /** 老学员姓名 */
  oldStudentName: string;
  /** 老学员手机号 */
  oldStudentMobile: string;
  /** 积分 */
  pointNum: number;
  /** 优惠券 */
  couponNum: number;
  /** 赠品 */
  giftNum: number;
  /** 用户id */
  oldStudentUserId: number;
  /**  是否为真正的老学员 */
  oldStudentFlag: number;
}

const NewStudentsLink: FC<NewStudentsLinkProps> = ({
  id,
  num,
  oldStudentName,
  newStudentState,
}) => {
  return num === 0 ? (
    <>0</>
  ) : (
    <BlankLink
      href={`${_global.url.v4}/vis/ump/invite-reward#/new-students/${id}?oldStudentName=${oldStudentName}&newStudentStatus=${newStudentState}`}
    >
      {num}
    </BlankLink>
  );
};

export const OldStudents: FC<OldStudentsProps> = ({ params: { id } }) => {
  const [activityData, setActivityData] = useState<ActivityBannerData | null>(null);
  const listRef = useRef<IListContext | null>(null);
  const abilitys = useMemo(() => {
    return getAbilitys();
  }, []);
  useEffect(() => {
    getDetail({ query: { id } }).then(data => {
      const {
        alias,
        baseInfoSetting: { name, startAt, endAt },
        ruleSetting: { newStudentRewardSettingType },
        newStudentPageSetting: { showJoinNum },
        status,
      } = data;
      setActivityData({
        name,
        startAt,
        endAt,
        status,
      });
      log({
        et: 'view',
        ei: 'enter_old_students_list',
        en: '进入老学员列表页',
        params: {
          showJoinNum,
          newStudentRewardType: newStudentRewardSettingType,
          name,
          alias,
        },
      });
    });
  }, [id]);

  const columns: IEasyGridColumn<OldStudentsListData>[] = useMemo(
    () => [
      {
        title: '老学员姓名',
        name: 'oldStudentName',
        bodyRender: ({ oldStudentFlag, oldStudentName, oldStudentId, oldStudentUserId }) => {
          if (!oldStudentName) return '-';
          if (oldStudentFlag) {
            return <StudentDetailLink studentId={oldStudentId}>{oldStudentName}</StudentDetailLink>;
          } else {
            return (
              <BlankLink
                href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${oldStudentUserId}`}
              >
                {oldStudentName}
              </BlankLink>
            );
          }
        },
      },
      {
        title: '转介绍新学员数',
        name: 'newStudentTotalNum',
        bodyRender: ({ newStudentTotalNum, oldStudentName }) => (
          <NewStudentsLink
            id={id}
            num={newStudentTotalNum}
            oldStudentName={oldStudentName}
            newStudentState={ClueStates.defaultState}
          />
        ),
      },
      {
        title: '待跟进',
        name: 'toFollowNum',
        bodyRender: ({ toFollowNum, oldStudentName }) => (
          <NewStudentsLink
            id={id}
            num={toFollowNum}
            oldStudentName={oldStudentName}
            newStudentState={ClueStates.toBeFollowedUp}
          />
        ),
      },
      {
        title: '已试听',
        name: 'followingNum',
        bodyRender: ({ followingNum, oldStudentName }) => (
          <NewStudentsLink
            id={id}
            num={followingNum}
            oldStudentName={oldStudentName}
            newStudentState={ClueStates.auditioned}
          />
        ),
      },
      {
        title: '已成交',
        name: 'dealNum',
        bodyRender: ({ dealNum, oldStudentName }) => (
          <NewStudentsLink
            id={id}
            num={dealNum}
            oldStudentName={oldStudentName}
            newStudentState={ClueStates.completed}
          />
        ),
      },
      {
        title: '获得的积分',
        name: 'pointNum',
        bodyRender: ({ pointNum }) => pointNum,
      },
      {
        title: '获得的优惠券',
        name: 'couponNum',
        bodyRender: ({ couponNum, oldStudentUserId, oldStudentName, oldStudentMobile }) => {
          if (couponNum === 0 || !abilitys.introductionDataView) return couponNum;
          return (
            <LinkButton
              onClick={() => {
                RewardRecordDialog({
                  userId: oldStudentUserId,
                  userName: oldStudentName,
                  userPhone: oldStudentMobile,
                  userLabel: '老学员',
                  activityId: Number(id),
                  rewardType: RewardTypeEnum.COUPON,
                  activityType: ActivityTypeEnum.INVITEREWARD,
                });
              }}
            >
              {couponNum}
            </LinkButton>
          );
        },
      },
      {
        title: '获得的赠品',
        name: 'giftNum',
        bodyRender: ({ giftNum, oldStudentUserId, oldStudentName, oldStudentMobile }) => {
          if (giftNum === 0 || !abilitys.introductionDataView) return giftNum;
          return (
            <LinkButton
              onClick={() => {
                RewardRecordDialog({
                  userId: oldStudentUserId,
                  userName: oldStudentName,
                  userPhone: oldStudentMobile,
                  userLabel: '老学员',
                  activityId: Number(id),
                  rewardType: RewardTypeEnum.PRESENT,
                  activityType: ActivityTypeEnum.INVITEREWARD,
                });
              }}
            >
              {giftNum}
            </LinkButton>
          );
        },
      },
    ],
    [abilitys.introductionDataView, id],
  );

  const fetchData = useCallback(
    data => {
      const { oldStudentName = '', page: pageNumber } = data;

      return findPromotionList({
        pageRequest: {
          pageSize: 10,
          pageNumber,
          sort: {
            orders: [
              {
                direction: 'DESC',
                property: 'newStudentTotalNum',
              },
            ],
          },
        },
        query: { oldStudentName, activityId: id },
      })
        .then(({ content, pageable, total }) => ({
          dataset: content,
          pageInfo: {
            page: pageable && pageable.pageNumber,
            pageSize: pageable && pageable.pageSize,
            total,
          },
        }))
        .catch(err => {
          throw Notify.error(err);
        });
    },
    [id],
  );

  return (
    <div className="activity-list">
      {activityData && <ActivityBanner activity={activityData} />}
      <List
        defaultFilter={{ pageSize: 10, page: 1 }}
        ref={listRef}
        mode="hash"
        onSubmit={fetchData}
      >
        <Search name="oldStudentName" placeholder="搜索老学员姓名" position="right" />
        <EasyGrid
          columns={columns}
          rowKey="oldStudentId"
          emptyLabel={<EmptyListTips>没有更多数据了</EmptyListTips>}
        />
      </List>
    </div>
  );
};
