import React, { FC, useState, useCallback, useMemo } from 'react';
import { Button, Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import toSnakeCase from '@youzan/utils/string/toSnakeCase';

import { listWatchDetail, exportLiveDetail } from '../../../api/live-manage';
import { PAGINATION_SIZE, columns } from './constants';
import { ILiveManageRecordManage } from '../../types';
import './styles.scss';
import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import ExportRecordLink, { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

const { List, Filter, EasyGrid } = EasyList;

const DetailList: FC<ILiveManageRecordManage> = ({ alias }) => {
  const [listHasData, toggleListHasData] = useState(false);
  const [keyword, setKeyword] = useState('');

  const config = useMemo<ICombinedFilterConf[]>(() => [
    {
      name: 'keyword',
      label: '客户名称：',
      type: 'Input',
      inheritProps: {
        placeholder: '客户名称/手机号',
        width: '184px',
      },
      onChange(value) {
        setKeyword(value);
      },
    }
  ], []);

  const fetch = useCallback((args) => {
    const { page, keyword, sortBy = 'firstWatchAt', sortType = '' } = args;
    const eduLiveDetailQuery = {
      alias,
      keyword,
    };
    const pageRequest = {
      pageNumber: page,
      pageSize: PAGINATION_SIZE,
      sort: {
        orders: [{
          property: toSnakeCase(sortBy),
          direction: sortType.toUpperCase() || 'DESC',
        }],
      }
    };
    return listWatchDetail({ eduLiveDetailQuery, pageRequest })
      .then(res => {
        const { content, pageable, total } = res;
        toggleListHasData(!!(content && content.length));

        return {
          dataset: content,
          pageInfo: {
            page: pageable.pageNumber,
            pageSize: pageable.pageSize,
            total,
          }
        };
      });
  }, [alias]);

  const exportForm = useCallback(() => {
    exportLiveDetail({
      alias,
      keyword,
    })
      .then(() => {
        Notify.success('正在导出，请稍后');
        window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.LIVE_STUDY_RECORD }));
      })
      .catch(e => {
        Notify.error(e || '导出数据失败，请稍后重试');
      });
  }, [alias, keyword]);

  return (
    <List
      onSubmit={fetch}
      defaultFilter={{ pageSize: 5 }}
      onError={e => {
        Notify.error(e || '获取学习明细列表失败，请稍后重试');
        toggleListHasData(false);
      }}
    >
      <Filter
        config={config}
        actionsOption={{
          beforeReset: [
            <Button
              key="export"
              className="export-btn"
              onClick={exportForm}
              disabled={!listHasData}
            >
              导出
            </Button>,
            <ExportRecordLink
              key="check-export-result"
              className="link-btn"
              target="_blank"
              rel="noopener noreferrer"
              exportType={EXPORT_RECORD_TYPES.LIVE_STUDY_RECORD}
            >
              查看已导出列表
            </ExportRecordLink>
          ],
        }}
      />
      <EasyGrid
        columns={columns}
        emptyLabel={!listHasData && !keyword &&
          <span>暂无数据</span>}
      />
    </List>
  );
};

export default DetailList;
