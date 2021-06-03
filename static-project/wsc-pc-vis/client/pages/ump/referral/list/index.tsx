import React, { FC, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { hashHistory } from 'react-router';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import { isUnifiedPartnerStore } from '@youzan/utils-shop';
import { pctCheck } from 'fns/auth';
import { VisButton } from 'fns/router';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import CommonLink from 'components/common-link';
import { showBdappCode } from 'common/api/request';
import EmptyListWrapper from './components/empty-list-wrapper';
import { columnConfig, filterConfig } from './config';
import { Provider, useStoreBy } from '../store';
import { getReferralList, endReferralActive, deleteReferralActive } from '../api/list';

import './styles.scss';

const { List, Search, EasyGrid, Filter, InlineFilter } = EasyList;
// const UmpAppId = 26247;

const ListPage: FC<unknown> = () => {
  const [startEmpty, setStartEmpty] = useState(true);
  const listRef = useRef<IListContext>(null);
  const refreshList = useCallback(() => {
    listRef.current && listRef.current.action.refresh();
  }, []);

  const [, setHasBdApp] = useStoreBy('hasBdApp');
  useEffect(() => {
    showBdappCode().then((res) => res && res.mpId && setHasBdApp(true));
  }, [setHasBdApp]);

  const onCreateCick = useCallback(() => {
    pctCheck()
      .then(() => {
        hashHistory.push('/add');
      })
      .catch(() => {});
  }, []);

  const onDeleteClick = useCallback(
    (activityId: number) => {
      pctCheck()
        .then(() => {
          deleteReferralActive({ activityId })
            .then(() => Notify.success('活动删除成功'))
            .then(refreshList)
            .catch((e) => Notify.error(e || '删除活动失败，请稍后重试'));
        })
        .catch(() => {});
    },
    [refreshList],
  );

  // 结束推荐有礼活动
  const handleInvalidate = useCallback(
    (activityId: number) => {
      pctCheck()
        .then(() => {
          endReferralActive({ activityId })
            .then(() => Notify.success('活动失效成功'))
            .then(refreshList)
            .catch((e) => Notify.error(e || '失效活动失败，请稍后重试'));
        })
        .catch(() => {});
    },
    [refreshList],
  );

  const fetchList: any = (filter) => {
    const { page, pageSize, keyword, type } = filter;
    const query: any = {};
    if (keyword) {
      query.keyword = keyword;
    }

    if (type && type !== '0') {
      query.status = type;
    }

    return getReferralList({ page, pageSize, ...query })
      .then((res) => {
        const { count, activities } = res;
        if (activities.length > 0) {
          setStartEmpty(false);
        }
        return {
          dataset: activities,
          pageInfo: {
            total: count,
            page: page,
          },
        };
      })
      .catch(() => {
        Notify.error('列表获取失败');
      });
  };

  const emptyLabel = useMemo(() => {
    return (
      <EmptyListWrapper>
        {startEmpty ? (
          <>
            暂无数据，
            <CommonLink url={`${window._global.url.v4}/vis/pct/page/referral#/add`} target="_self">
              去新建
            </CommonLink>
          </>
        ) : (
          '没有更多数据了'
        )}
      </EmptyListWrapper>
    );
  }, [startEmpty]);

  return (
    <div className="page-container">
      <div className="event-list">
        <h1>推荐有奖</h1>
        <List
          onSubmit={fetchList}
          mode="none"
          defaultFilter={{ pageSize: 10 }}
          ref={listRef}
          onError={Notify.error}
        >
          <InlineFilter
            left={
              <ShowWrapper
                isInStoreCondition={
                  !(isInStoreCondition({ supportBranchStore: true }) || isUnifiedPartnerStore)
                }
              >
                <VisButton type="primary" pctCheck onClick={onCreateCick}>
                  新建活动
                </VisButton>
              </ShowWrapper>
            }
            right={[
              <Filter
                key="filter"
                config={[filterConfig]}
                backgroundColor="transparent"
                autoFilter
              />,
              <Search key="search" name="keyword" placeholder="搜索活动名称" />,
            ]}
          />
          <EasyGrid
            columns={columnConfig({
              endReferralActive: handleInvalidate,
              onDeleteClick,
            })}
            scroll={{ x: 1580 }}
            emptyLabel={emptyLabel}
          />
        </List>
      </div>
    </div>
  );
};

export default (props) => (
  <Provider>
    <ListPage {...props} />
  </Provider>
);
