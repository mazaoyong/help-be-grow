// 用于渲染一个拥有行点击事件的table
// 拥有loading, datasets, columns, emptyLabel等属性
import React, { Component, ReactNode } from 'react';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { BlockLoading } from 'zent';
import { IClickTableProps } from './types';
import './style.scss';

export * from './types';

export default class ClickTable extends Component<IClickTableProps> {
  static defaultProps: IClickTableProps = {
    columns: [],
    datasets: [],
    emptyLabel: '没有更多数据了',
    loading: false,
  };

  renderTableHead(): ReactNode[] {
    const { columns } = this.props;
    return columns.map((col: any) => {
      const { title, textAlign, width } = col;
      return (
        <th
          key={uniqueId()}
          style={{ textAlign: textAlign || 'left', width }}
        >{title}</th>
      );
    });
  }

  // 点击一行的时候触发的事件
  handleClickRow = (data: any, index: number) => {
    const { onClickRow } = this.props;
    this.setState({
      currentRow: index,
    });

    if (onClickRow) {
      onClickRow(data, index);
    }
  };

  // 在事件捕获阶段拦截数据
  handleDisable = (
    disabled: boolean,
    evt: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => {
    if (disabled) {
      evt.stopPropagation();
    }
  };

  renderTableCells(data: object, index: number): (ReactNode | ReactNode[]) {
    const { columns } = this.props;
    return columns.map((col: any) => {
      const { bodyRender, name, textAlign, disable } = col;
      let isDisabled = false;
      if (disable) {
        isDisabled = disable(data, index);
      }
      if (bodyRender) {
        return (
          <td key={uniqueId()} style={{ textAlign }}>
            {bodyRender(data, index, isDisabled)}
          </td>
        );
      }
      const context = get(data, name as string) || '';
      return (
        <td
          key={uniqueId()}
          style={{ textAlign }}
          onClickCapture={this.handleDisable.bind(this, isDisabled)}
        >
          {context}
        </td>
      );
    });
  }

  renderTableBody(): (ReactNode | ReactNode[]) {
    const { datasets, emptyLabel, currentRow, disabledRow } = this.props;
    if (!datasets.length) {
      return (
        <tr className="row">
          <td colSpan={99} style={{ textAlign: 'center' }}>{emptyLabel || '没有更多数据了'}</td>
        </tr>
      );
    }
    return datasets.map((data: any, index: number) => {
      let isCurrentRow = false;
      let isDisabledRow = false;
      if (currentRow) {
        isCurrentRow = currentRow(data);
      }
      if (disabledRow) {
        isDisabledRow = disabledRow(data);
      }
      return (
        <tr
          key={uniqueId()}
          className={`row ${(!isDisabledRow && isCurrentRow) ? 'current' : ''} ${isDisabledRow ? 'disabled' : ''}`}
          onClick={isDisabledRow ? () => { } : this.handleClickRow.bind(this, data, index)}
        >{this.renderTableCells(data, index)}</tr>
      );
    });
  }

  render() {
    const { scroll } = this.props;
    const style: any = {};
    if (scroll && scroll.y) {
      style.maxHeight = scroll.y + 'px';
      style.overflowY = 'scroll';
    }
    return (
      <BlockLoading loading={this.props.loading}>
        <table className="click-table">
          <thead className="head">
            <tr>{this.renderTableHead()}</tr>
          </thead>
        </table>
        <div style={style}>
          <table className="click-table">
            <tbody className="body">
              {this.renderTableBody()}
            </tbody>
          </table>
        </div>
      </BlockLoading>
    );
  }
}
