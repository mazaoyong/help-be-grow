import React, { ReactNode } from 'react';
import { ITableOptions, IDialogProps, INormalizedTableOptions } from './types';
import { Table } from '@zent/compat';

export default function renderTable(tableOptions: ITableOptions, props: IDialogProps, datasets: any[]): ReactNode {
  const { select, table, loading } = props;
  // @upgrade: zent8
  const { rowKey, ...restTableOptions } = (tableOptions as INormalizedTableOptions);

  const { current, pageSize, totalItem, selectedRows } = table;
  const _pageInfo = {
    current: current || 1,
    pageSize: pageSize || 20,
    totalItem: totalItem || 0,
  };

  const _selection = Object.assign({}, tableOptions.selection, {
    onSelect: select,
    selectedRowKeys: selectedRows.map(selectedRow => selectedRow[rowKey]),
  });

  return (
    <Table
      {...restTableOptions}
      loading={loading}
      rowKey={rowKey}
      datasets={datasets}
      pageInfo={_pageInfo}
      selection={_selection as any}
      onChange={params => {
        props.change(params).then(props.fetch);
      }}
    />
  );
}
