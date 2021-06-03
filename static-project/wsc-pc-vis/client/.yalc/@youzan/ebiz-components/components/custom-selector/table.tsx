import React, { ReactNode } from 'react';
import { ITableOptions, IDialogProps } from './types';
import { Table } from 'zent';

export default function renderTable(tableOptions: ITableOptions, props: IDialogProps, datasets: any[]): ReactNode {
  const { select, table, ext, loading } = props;
  const { rowKey, columns, ...restTableOptions } = tableOptions;

  const { current, pageSize, totalItem, selectedRows } = table;
  const _pageInfo = {
    current: current || 1,
    pageSize: pageSize || 20,
    totalItem: totalItem || 0,
  };

  const _selection = Object.assign({}, tableOptions.selection, {
    onSelect: select,
    selectedRowKeys: selectedRows.map((selectedRow: { [x: string]: any; }) => selectedRow[rowKey]),
  });

  const _columns: any = columns.map(({ bodyRender, ...restColumn }) => {
    if (bodyRender) {
      return {
        bodyRender: (data: any) => bodyRender(data, {
          ext,
          onExtChange: (ext, cb) => {
            if (typeof ext === 'function') {
              props.setExt(ext(props.ext), cb);
            } else {
              props.setExt(ext, cb);
            }
          },
          onRowSelect: () => {
            // only support one data selected currently
            const notSelected = selectedRows.findIndex((selectedRow: { [x: string]: any; }) => selectedRow[rowKey] === data[rowKey]) === -1;
            if (notSelected) {
              const _selectedRows = selectedRows.concat([data]);
              select(_selectedRows.map((selectedRow: { [x: string]: any; }) => selectedRow[rowKey]), _selectedRows, data);
            }
          },
        }),
        ...restColumn,
      };
    }
    return { ...restColumn };
  });

  return (
    <Table
      {...restTableOptions}
      loading={loading}
      rowKey={rowKey}
      columns={_columns}
      datasets={datasets}
      pageInfo={_pageInfo}
      selection={_selection as any}
      onChange={params => {
        props.change(params).then(props.fetch);
      }}
    />
  );
}
