import React, { FC, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { hashHistory } from 'react-router';
import { ClampLines, Button, Notify } from 'zent';
import { date, url, number } from '@youzan/utils';
import { EasyList } from '@youzan/ebiz-components';
import { IEasyGridColumn, ISelectConfType, IListContext, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import isNil from 'lodash/isNil';
import { UmpAppBoardV2 } from '@youzan/react-components';
import { abilityCheck } from 'fns/auth/ability-check-status';
import { IVisRouterProps } from 'fns/router';
import { explosureTracker } from 'fns/web-tracker';
import { showBdappCode } from 'common/api/request';
import CommonLink from 'components/common-link';
import ListOperations from './components/list-operations';
import EmptyListWrapper from 'components/empty-list-wrapper';

import type { ITuitionListDTO } from 'definitions/api/owl/pc/TuitionPCFacade/findByPage';
import { EventStatus } from '../types';
import { eventStatusMap, APPID, AbilityCode, AppName } from '../constants';
import type { IListpageQuery } from './types';
import { findTuitionOffsetEventByPage, expireTuitionOffsetEventById, deleteTuitionOffsetEventById } from '../api/list';

import './styles.scss';

const LIST_PAGE_SIZE = 10;

const { List, EasyGrid, Search, Filter, InlineFilter } = EasyList;

const { accDiv } = number;

const statusSelectOptions = Object.keys(eventStatusMap)
  .sort((a, b) => Number(a) - Number(b))
  .map(status => ({
    value: String(status),
    text: eventStatusMap[status],
  }));

const searchSelectConfig: ISelectConfType = {
  name: 'status',
  type: 'Select',
  defaultValue: `${EventStatus.all}`,
  inheritProps: {
    width: 182,
    autoWidth: true,
  },
  options: statusSelectOptions,
};

const ListPage: FC<IVisRouterProps> = (props) => {
  const { query } = props.location;
  const [listpageQuery, setListpageQuery] = useState(query);
  const [showBdapp, setShowBdapp] = useState(false);
  const listRef = useRef<IListContext>(null);

  useEffect(() => {
    // 进入页面埋点
    explosureTracker({
      pageType: 'TuitionOffset',
      eventSign: 'enterpage_list',
      eventName: '访问攒学费列表页',
      otherParams: {
        rurl: document.referrer || '',
      },
    });

    showBdappCode()
      .then(res => {
        res && res.mpId && setShowBdapp(true);
      });
  }, []);

  const refreshList = useCallback(() => {
    listRef.current && listRef.current.action.refresh();
  }, []);

  // 返回promise用于pop的onConfirm，会在promise返回resolve时异步关闭pop弹层
  const handleInvalidate = useCallback((id: number) => {
    return expireTuitionOffsetEventById({ id })
      .then(() => Notify.success('活动失效成功'))
      .then(refreshList)
      .catch(e => {
        Notify.error(e || '失效活动失败，请稍后重试');
      });
  }, [refreshList]);

  // 返回promise用于pop的onConfirm，会在promise返回resolve时异步关闭pop弹层
  const handleDelete = useCallback((id: number) => {
    return deleteTuitionOffsetEventById({ id })
      .then(() => Notify.success('活动删除成功'))
      .then(refreshList)
      .catch(e => {
        Notify.error(e || '删除活动失败，请稍后重试');
      });
  }, [refreshList]);

  const columns: IEasyGridColumn<ITuitionListDTO>[] = useMemo(() => [
    {
      title: '活动名称',
      name: 'name',
      fixed: 'left',
      width: 203,
      bodyRender: (data) => (
        data.status === EventStatus.invalid || data.status === EventStatus.ended
          ? <ClampLines lines={2} text={data.name || ''} />
          : <CommonLink
            url={url.buildUrl(
              `/wscvis/ump/tuition/${data.alias}?kdt_id=${_global.kdtId}`,
              'h5',
              _global.kdtId,
            )}
            target="_blank"
          >
            <ClampLines lines={2} text={data.name || ''} />
          </CommonLink>
      ),
    },
    {
      title: '活动时间',
      name: 'time',
      width: 190,
      bodyRender: (data) => {
        if (!data.startAt || !data.endAt) {
          return '-';
        }
        return `${
          date.makeDateTimeStr(data.startAt)
        } 至 ${date.makeDateTimeStr(data.endAt)}`;
      },
    },
    {
      title: '活动状态',
      name: 'status',
      bodyRender: (data) =>
        isNil(data.status) ? '-' : eventStatusMap[data.status]
    },
    {
      title: '活动参与人数',
      name: 'joinCnt',
    },
    {
      title: '订单数',
      name: 'orderCnt',
    },
    {
      title: '订单总金额(元)',
      name: 'orderAmount',
      textAlign: 'right',
      bodyRender: ({ orderAmount }) => accDiv(Number(orderAmount), 100),
    },
    {
      title: '操作',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: (data) => (
        <ListOperations
          data={data}
          handleDelete={handleDelete}
          handleInvalidate={handleInvalidate}
          showBdapp={showBdapp}
        />
      ),
    },
  ], [handleDelete, handleInvalidate, showBdapp]);

  const fetchData = useCallback((query: IListpageQuery): Promise<IFormatData> => {
    const { name = '', status = EventStatus.all, pageSize = LIST_PAGE_SIZE, page: pageNumber } = query;
    setListpageQuery(query);
    return findTuitionOffsetEventByPage({
      query: { name, status },
      pageRequest: { pageNumber, pageSize },
    }).then(data => ({
      dataset: data.content,
      pageInfo: {
        page: pageNumber,
        pageSize,
        total: data.total,
      }
    })).catch(err => {
      throw Notify.error(err || '获取列表数据失败，请稍后重试');
    });
  }, []);

  const emptyLabel = useMemo(() => {
    const { page = '1', name = '', status = '' } = listpageQuery;
    const isFirstPage = String(page) === '1';
    const allTypes = !status || status === String(EventStatus.all);

    return (
      <EmptyListWrapper>
        {
          isFirstPage && !name && allTypes // 如果初始状态没有数据
            ? <>
              暂无数据，
              <CommonLink url={`${window._global.url.v4}/vis/ump/tuition-offset#/add`} target="_self">
              去新建
              </CommonLink>
            </>
            : '没有更多数据了'
        }
      </EmptyListWrapper>
    );
  }, [listpageQuery]);

  const handleCreate = useCallback(() => {
    abilityCheck({
      abilityCode: AbilityCode,
      appId: APPID,
      name: AppName
    }).then(() => {
      hashHistory.push('add');
    });
  }, []);

  return (
    <div className="page-container">
      <div className="event-list">
        <UmpAppBoardV2 id={APPID} title="攒学费" />
        <List mode="hash" onSubmit={fetchData} ref={listRef} defaultFilter={{ pageSize: LIST_PAGE_SIZE }}>
          <InlineFilter
            left={
              <Button type="primary" onClick={handleCreate}>新建活动</Button>
            }
            right={[
              <Filter key="filter" config={[searchSelectConfig]} backgroundColor="transparent" autoFilter />,
              <Search key="search" name="name" placeholder="搜索活动名称" />,
            ]}
          />
          <EasyGrid
            columns={columns}
            rowKey="id"
            scroll={{ x: 1111 }}
            emptyLabel={emptyLabel}
          />
        </List>
      </div>
    </div>
  );
};

export default ListPage;
