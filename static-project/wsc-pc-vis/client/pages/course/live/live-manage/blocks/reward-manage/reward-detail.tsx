import React, { FC, useCallback, useRef } from 'react';
import get from 'lodash/get';
import { hot } from 'react-hot-loader';
import { EasyList } from '@youzan/ebiz-components';
import { Button, Notify } from 'zent';
import makeDateTimeStr from '@youzan/utils/date/makeDateTimeStr';
// import { IFilterProps, IRenderPropsType } from '@youzan/ebiz-components/es/types/easy-list/types/filter';
import { findByCondition, exportByCondition } from '../../../api/live-manage';
import {
  IEasyGridColumn,
  IListProps,
  IListContext,
  IRenderPropsType,
  ICombinedFilterConf,
  IFilterProps,
} from '@youzan/ebiz-components/es/types/easy-list';

import { formatParams } from '../../../../common/helper';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import ExportRecordLink, {
  getExportRecordUrl,
  EXPORT_RECORD_TYPES,
} from '@ability-center/ump/export-record';

const { List, Filter, EasyGrid } = EasyList;

interface IRewardSettingProps {
  alias: string;
}

interface IListParams {
  alias: string;
  userNameOrPhone: string;
  page: number;
  pageSize: number;
  sortType?: 'ASNC' | 'DESC';
  sortBy: string;
}

const RewardDetail: FC<IRewardSettingProps> = (props) => {
  const { alias } = props;

  const listRef = useRef<IListContext>(null);
  const filterRef = useRef<IRenderPropsType>(null);

  const getFilterConfig: ICombinedFilterConf[] = [
    {
      name: 'userNameOrPhone',
      label: '客户',
      type: 'Input',
      inheritProps: {
        placeholder: '客户名称/手机号',
        onPressEnter: () => {
          get(filterRef, 'current.submit', () => {})();
        },
      },
    },
  ];

  const Actions: IFilterProps['renderActions'] = ({ filter }) => {
    const { submit, reset } = filter;
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            submit();
          }}
        >
          筛选
        </Button>
        <Button className="btn-export" onClick={handleExport}>
          导出
        </Button>
        <ExportRecordLink
          rel="noopener noreferrer"
          className="btn-line"
          target="_blank"
          exportType={EXPORT_RECORD_TYPES.LIVE_REWARD}
        >
          查看已导出列表
        </ExportRecordLink>
        <a className="btn-reset" onClick={reset}>
          重置筛选条件
        </a>
      </>
    );
  };

  const columns = useCallback(() => {
    return [
      {
        title: '客户名称',
        name: 'userName',
        width: '200px',
        bodyRender(item) {
          const { userId, userName } = item;
          const customDetailUrl = `/v4/scrm/customer/manage#/detail?yzUid=${userId}`;
          return (
            <a className="ellipsis-2" href={customDetailUrl}>
              {userName}
            </a>
          );
        },
      },
      {
        title: '打赏金额(元)',
        name: 'payAmount',
        needSort: true,
        textAlign: 'right',
        bodyRender(item) {
          const { payAmount = 0 } = item;
          return <span>{+payAmount / 100}</span>;
        },
      },
      {
        title: '订单号',
        name: 'orderNo',
      },
      {
        title: '打赏时间',
        name: 'payTime',
        needSort: true,
        bodyRender(item) {
          const { payTime = 0 } = item;
          return <span>{makeDateTimeStr(+payTime)}</span>;
        },
      },
      {
        title: '支付方式',
        name: 'payWay',
      },
    ] as IEasyGridColumn[];
  }, []);

  function getNewFetchParams(conf) {
    const params = mapKeysToCamelCase(conf);
    const { page, pageSize, sortBy = 'payTime', sortType = 'DESC', userNameOrPhone = '' } = params;

    const data: IListParams = {
      page: Number(page) || 1,
      pageSize,
      userNameOrPhone,
      sortType: sortType.toUpperCase(),
      sortBy,
      alias,
    };

    return data;
  }

  const fetch = useCallback<IListProps['onSubmit']>((state) => {
    const { query, pageRequest } = formatParams(getNewFetchParams(state));
    return new Promise((resolve, reject) => {
      findByCondition({
        query,
        pageRequest,
      })
        .then((res) => {
          const { content = [], pageable = {}, total = 0 } = res;
          const { pageNumber = 0, pageSize = 0 } = pageable;
          resolve({
            dataset: content,
            pageInfo: { page: pageNumber, pageSize, total },
          });
        })
        .catch((err) => {
          reject(err);
          Notify.error(err);
        });
    });
  }, []);

  const handleExport = useCallback(() => {
    Notify.success('正在申请导出...');
    exportByCondition({ alias })
      .then(() => {
        Notify.success('导出请求成功!');
        window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.LIVE_REWARD }));
      })
      .catch((err) => {
        Notify.error(err);
      });
  }, []);

  return (
    <section className="reward-detail">
      <h1>打赏明细</h1>
      <div className="reward-detail__list">
        <List ref={listRef} mode="hash" onSubmit={fetch} defaultFilter={{ pageSize: 10 }}>
          <Filter ref={filterRef} config={getFilterConfig} renderActions={Actions} />
          <EasyGrid columns={columns()} emptyLabel="还没有打赏" rowKey="orderNo" />
        </List>
      </div>
    </section>
  );
};

export default hot(module)(RewardDetail);
