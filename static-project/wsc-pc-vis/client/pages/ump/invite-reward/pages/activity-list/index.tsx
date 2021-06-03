import React, { FC, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import { get } from 'lodash';
import { ClampLines, Notify } from 'zent';
import { date, url } from '@youzan/utils';
import { EasyList } from '@youzan/ebiz-components';
import {
  IEasyGridColumn,
  ISelectConfType,
  IListContext,
} from '@youzan/ebiz-components/es/types/easy-list';
import { BlankLink, UmpAppBoardV2 } from '@youzan/react-components';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { Button as SamButton } from '@youzan/sam-components';
import { EmptyListTips } from '../../components/empty-list-tips';
import { ActivityStatus, ActivityListData } from '../../types';
import { statusLabel } from '../../constants';
import { findByPage } from '../../api';
import Operate from './components/operate';
import { getAbilitys } from '../../utils';

import './style.scss';

const APPID = null; // todo: 转介绍appid
const { List, EasyGrid, Search, Filter, InlineFilter } = EasyList;

const fetchData = data => {
  const { name = '', status = -1, pageSize, page: pageNumber } = data;

  return findByPage({
    pageRequest: {
      pageSize,
      pageNumber,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'id',
          },
        ],
      },
    },
    query: { name, status },
  })
    .then(data => ({
      dataset: data.content,
      pageInfo: {
        page: pageNumber,
        pageSize,
        total: data.total,
      },
    }))
    .catch(err => {
      throw Notify.error(err);
    });
};

const statusSelectOptions = [
  { value: ActivityStatus.all, text: statusLabel[ActivityStatus.all] },
  { value: ActivityStatus.notStarted, text: statusLabel[ActivityStatus.notStarted] },
  { value: ActivityStatus.ongoing, text: statusLabel[ActivityStatus.ongoing] },
  { value: ActivityStatus.ended, text: statusLabel[ActivityStatus.ended] },
  { value: ActivityStatus.invalid, text: statusLabel[ActivityStatus.invalid] },
].map(it => ({
  ...it,
  value: `${it.value}`,
}));

const statusNames = statusSelectOptions.reduce((obj, curr) => {
  obj[curr.value] = curr.text;
  return obj;
}, {});

const searchSelectConfig: ISelectConfType = {
  name: 'status',
  type: 'Select',
  defaultValue: `${ActivityStatus.all}`,
  inheritProps: {
    width: 182,
    autoWidth: true,
  },
  options: statusSelectOptions,
};

export const ActivityList: FC = () => {
  const listRef = useRef<IListContext | null>(null);
  const refreshList = () => listRef.current && listRef.current.action.refresh();
  const abilitys = useMemo(() => {
    return getAbilitys();
  }, []);

  const kdtId = useMemo(() => {
    const chainOnlineShopMode = get(_global, 'shopInfo.chainOnlineShopMode', 1);
    const kdtId = chainOnlineShopMode === 2 ? get(_global, 'shopInfo.parentKdtId', _global.kdtId) : _global.kdtId;
    return kdtId;
  }, []);

  const columns: IEasyGridColumn<ActivityListData>[] = useMemo(
    () => [
      {
        title: '活动名称',
        name: 'name',
        fixed: 'left',
        width: 203,
        bodyRender: data => (
          <BlankLink
            href={url.buildUrl(
              `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&from=invite_reward&alias=${data.alias}`,
              'h5',
            )}
          >
            <ClampLines lines={2} text={data.name} />
          </BlankLink>
        ),
      },
      {
        title: '活动时间',
        name: 'time',
        width: 190,
        bodyRender: data =>
          `${date.makeDateTimeStr(data.startAt)} 至 ${date.makeDateTimeStr(data.endAt)}`,
      },
      {
        title: '活动状态',
        name: 'status',
        bodyRender: data => statusNames[data.status],
      },
      {
        title: '老学员参与数',
        name: 'oldStudentJoinNum',
        width: 190,
        bodyRender: ({ oldStudentJoinNum, id }) => {
          if (oldStudentJoinNum === 0 || !abilitys.introductionDataView) return oldStudentJoinNum;
          return <Link to={`old-students/${id}`}>{oldStudentJoinNum}</Link>;
        },
      },
      {
        title: '转介绍新学员数',
        name: 'newStudentJoinNum',
        width: 190,
        bodyRender: ({ newStudentJoinNum, id }) =>
          newStudentJoinNum === 0 ? (
            0
          ) : (
            <Link disabled={newStudentJoinNum === 0} to={`new-students/${id}`}>
              {newStudentJoinNum}
            </Link>
          ),
      },
      abilitys.chainStore && abilitys.introductionDataView && {
        title: '适用校区',
        name: 'designateType',
        bodyRender: ({ designateType }) => (designateType === 0 ? '全部校区' : '部分校区'),
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender({
          id,
          name,
          alias,
          status,
          isOldStruct,
          oldStudentRewardRuleDesc,
          startAt,
          endAt,
        }) {
          return (
            <Operate
              status={status}
              name={name}
              introductionDataView={abilitys.introductionDataView}
              id={id}
              alias={alias}
              refreshList={refreshList}
              isOldStruct={isOldStruct}
              oldStudentRewardRuleDesc={oldStudentRewardRuleDesc}
              startAt={startAt}
              endAt={endAt}
            />
          );
        },
      },
    ],
    [abilitys.chainStore, abilitys.introductionDataView, kdtId],
  );

  return (
    <div className="activity-list">
      {APPID ? (
        <UmpAppBoardV2 id={APPID} title="转介绍" />
      ) : (
        <h1
          style={{
            lineHeight: '24px',
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          转介绍
        </h1>
      )}
      <List ref={listRef} mode="hash" onSubmit={fetchData}>
        <InlineFilter
          left={
            <ArthurContainer name="introductionDataView" namespace="转介绍">
              <Link to="add">
                <SamButton name="转介绍编辑" type="primary">
                  新建活动
                </SamButton>
              </Link>
            </ArthurContainer>
          }
          right={[
            <Filter
              key="filter"
              config={[searchSelectConfig]}
              backgroundColor="transparent"
              autoFilter
            />,
            <Search key="search" name="name" placeholder="搜索活动名称" />,
          ]}
        />
        <EasyGrid
          columns={columns}
          rowKey="id"
          scroll={{ x: 1111 }}
          emptyLabel={
            <EmptyListTips>
              {listRef.current &&
              !listRef.current.state.filter.name &&
              (listRef.current.state.filter.status === '-1' ||
                listRef.current.state.filter.status === undefined) ? (
                  <>
                    暂无数据
                    <ArthurContainer name="introductionDataView" namespace="转介绍">
                      <BlankLink href={`${window._global.url.v4}/vis/ump/invite-reward#/add`}>
                        ，去新建
                      </BlankLink>
                    </ArthurContainer>
                  </>
                ) : (
                  <>没有更多数据了</>
                )}
            </EmptyListTips>
          }
        />
      </List>
    </div>
  );
};
