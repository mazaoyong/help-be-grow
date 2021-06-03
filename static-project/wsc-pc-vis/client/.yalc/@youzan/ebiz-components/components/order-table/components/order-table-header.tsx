/* eslint-disable react/display-name */
import React, { ReactNode, CSSProperties } from 'react';
import { orderTableCols, Omit } from '../types';
import { Checkbox } from 'zent';

interface IOrderTableHeader {
  selectable: boolean;
  header: string[];
  columns: orderTableCols;
  selectStatus: { [key: string]: boolean };
  onSelectAll: (status: boolean) => void;
}

interface IOrderTableHeaderItem {
  title: ReactNode;
  width?: string;
  textAlign?: CSSProperties['textAlign'];
  status: IOrderTableHeader['selectStatus'];
  onSelect: IOrderTableHeader['onSelectAll'];
}

type omitDataProperties = 'status' | 'onSelect';
type omitSelectProperties = 'title' | 'width' | 'textAlign';

const OrderTableHeader = (props: IOrderTableHeader) => {
  // 筛选出需要在头部显示的所有title
  const headMap = props.columns
    .filter(col => props.header.findIndex(head => head === col.name) > -1)
    .map(col => ({ title: col.title, width: col.width, textAlign: col.textAlign || 'left' }));

  // 如果需要使用选择属性，则在每行的第一个单元格渲染一个checkbox
  return (
    <thead>
      <tr className="ebiz-order-table__tr">
        {props.selectable && (
          <th
            style={{ width: '34px', minWidth: '34px' }}
            className="ebiz-order-table__tr-cell cell__selection"
          >
            <OrderTableHeader.CheckBox status={props.selectStatus} onSelect={props.onSelectAll} />
          </th>
        )}
        {headMap.map((item, index) => (
          <OrderTableHeader.Item key={index} {...item} />
        ))}
      </tr>
      <tr className="ebiz-order-table__blank-start" />
    </thead>
  );
};

// 渲染checkbox的组件
OrderTableHeader.CheckBox = (props: Omit<IOrderTableHeaderItem, omitSelectProperties>) => (
  <Checkbox onChange={e => props.onSelect(e.target.checked)} {...props.status} />
);

(OrderTableHeader.CheckBox as React.ComponentType).displayName = 'OrderTableCheckBox';

// 渲染标题每一项的组件
OrderTableHeader.Item = (props: Omit<IOrderTableHeaderItem, omitDataProperties>) => (
  <th
    className="ebiz-order-table__tr-cell"
    style={{ width: props.width, minWidth: props.width, textAlign: props.textAlign }}
  >
    <div>{props.title}</div>
  </th>
);
(OrderTableHeader.Item as React.ComponentType).displayName = 'OrderTableItem';

export default OrderTableHeader;
