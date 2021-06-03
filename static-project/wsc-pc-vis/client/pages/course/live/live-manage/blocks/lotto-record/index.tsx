import React, { FC, useState, useCallback, useRef, useMemo } from 'react';
import { Notify } from 'zent';
import { throttle } from 'lodash';
import {
  IEasyGridColumn,
  IListContext,
  IListProps,
} from '@youzan/ebiz-components/es/types/easy-list';
import { EasyList } from '@youzan/ebiz-components';
import { Link as SamLink } from '@youzan/sam-components';
import { format } from 'date-fns';

import { findWinLotteryPage, submitExportTask } from '../../../api/live-manage';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import type {
  ILiveLotteryPageDTO,
  IPage,
} from 'definitions/api/owl/pc/LiveLotteryFacade/findWinLotteryPage';

import './styles.scss';

const { List, EasyGrid } = EasyList;

interface ILottoRecordFilter {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
}

const LottoRecord: FC<{ alias: string }> = props => {
  const { alias } = props;
  const [listUpdateTime, setListUpdateTime] = useState(format(Date.now(), 'YYYY.M.D HH:mm:ss'));

  const listRef = useRef<IListContext>(null);

  const refreshList = useCallback(throttle(() => {
    listRef.current && listRef.current.action.refresh();
    setListUpdateTime(format(Date.now(), 'YYYY.M.D HH:mm:ss'));
  }, 1000), []);

  const handleExport = useCallback(
    (lotteryId: string) => {
      submitExportTask({ alias, lotteryId })
        .then(() => {
          Notify.success('申请导出成功，页面跳转中...');
          window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.LIVE_LOTTO_RECORD_EXPORT_TYPE }));
        })
        .catch(e => {
          Notify.error(e || '申请导出失败，请稍后重试');
        });
    },
    [alias],
  );

  const columns: IEasyGridColumn[] = useMemo(
    () => [
      {
        title: '抽奖时间',
        width: 240,
        bodyRender: ({ createdTime }) => {
          return <span>{createdTime ? format(createdTime, 'YYYY.M.D HH:mm:ss') : '-'}</span>;
        },
      },
      {
        title: '中奖人数',
        width: 528,
        name: 'winnerCount',
      },
      {
        title: '操作',
        width: 160,
        textAlign: 'right',
        bodyRender: ({ lotteryId }) => {
          return (
            <SamLink className="operation" name="编辑" onClick={() => handleExport(lotteryId)}>
              导出
            </SamLink>
          );
        },
      },
    ],
    [handleExport],
  );

  const fetchLottoRecord = useCallback<IListProps['onSubmit']>(
    (query: ILottoRecordFilter) => {
      const { page, pageSize } = query;
      return new Promise((resolve, reject) => {
        findWinLotteryPage({
          query: { alias },
          pageRequest: {
            pageNumber: page,
            pageSize,
          },
        })
          .then((res: IPage<ILiveLotteryPageDTO>) => {
            const { content, total, pageable } = res;

            resolve({
              ...res,
              dataset: content,
              pageInfo: { total, page, ...pageable },
            });
          })
          .catch(e => {
            reject(e);
            Notify.error(e || '获取抽奖记录列表失败，请稍后刷新重试');
          });
      });
    },
    [alias],
  );

  return (
    <div className="lotto-record">
      <div className="header">
        <span className="title">抽奖记录</span>
        <span className="operation" onClick={refreshList}>
          刷新
        </span>
        <span className="latest-updated-at">{`最近刷新时间 ${listUpdateTime}`}</span>
      </div>
      <List ref={listRef} mode="hash" onSubmit={fetchLottoRecord} defaultFilter={{ pageSize: 10 }}>
        <EasyGrid columns={columns} pageSizeOptions={[10, 20]} emptyLabel={<span>暂无数据</span>} />
      </List>
    </div>
  );
};

export default LottoRecord;
