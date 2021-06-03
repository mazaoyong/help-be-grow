import React, { useEffect } from 'react';
import assign from 'lodash/assign';
import { Table } from '@zent/compat';
import { BRANCH_STORE_NAME } from 'constants/chain';

const SHOP_LIFECYCLE_STATUS = {
  try: '试用期',
  valid: '服务期',
  protect: '保护期',
  pause: '歇业',
  close: '打烊',
  delete: '删除',
  prepare: '准备期',
  invalid: '无效',
};

const defaultColumns = [
  {
    title: BRANCH_STORE_NAME,
    name: 'schoolName',
    bodyRender: data => {
      return <span>{data.shopName}</span>;
    },
  },
  {
    title: '地址',
    name: 'address',
    bodyRender: data => {
      return (
        <span>
          {data.address}
        </span>
      );
    },
  },
  {
    title: `${BRANCH_STORE_NAME}状态/到期时间`,
    name: 'status',
    bodyRender: data => {
      const day = new Date(data.lifecycleEndTime);
      return (
        <>
          <div>
            {SHOP_LIFECYCLE_STATUS[data.lifecycleStatus]}
          </div>
          <div>
            { !!day && `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`}
          </div>
        </>
      );
    },
  },
];

export default function ListFC(props) {
  const { datasets, loading, fetchData, onSelect, columns, emptyLabel, sortBy, rowKey, hasSelect,
    isSingleSelection = false, ...otherProps } = props;
  const { content, pageInfo, selectInfo } = datasets;
  useEffect(
    () => {
      const { filterInfo, pageInfo } = datasets;
      fetchData({ filterConditions: filterInfo, pageConditions: pageInfo });
    },
    [],
  );

  const onPageChange = (conf) => {
    const { filterInfo, pageInfo } = datasets;
    fetchData({ filterConditions: filterInfo, pageConditions: assign({}, pageInfo, { current: conf.current }) });
  };
  return <Table
    columns={columns || defaultColumns}
    sortBy={sortBy || 'created_at'}
    loading={loading}
    rowKey={rowKey || 'shopName'}
    datasets={content}
    onChange = {(conf) => onPageChange(conf) }
    pageInfo={pageInfo}
    emptyLabel={emptyLabel || '没有更多数据了'}
    selection={hasSelect ? {
      selectedRowKeys: selectInfo.selectedRowKeys,
      needCrossPage: true,
      isSingleSelection: isSingleSelection,
      onSelect: (selectedRowKeys, selectedRows, currentRow) => {
        onSelect(selectedRowKeys, selectedRows, currentRow);
      },
    } : null}
    {...otherProps}
  />;
}
