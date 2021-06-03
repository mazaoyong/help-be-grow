import isEqual from 'lodash/isEqual';
import React, { Component, ReactNode } from 'react';
import { VisTable } from '../index';
import VisFilter from '../components/vis-filter';
import { ICompRouter, IVisListFilterProps, IVisListTableProps } from '../ultis/type';
import { IGridProps } from 'zent/es';

interface IFilterTableProps extends ICompRouter {
  onChange?: (params: { filterChange: object; tableChange: object }) => void;
  filterProps: Exclude<IVisListFilterProps, keyof ICompRouter | 'onChange'>;
  tableProps: Exclude<Omit<IGridProps, 'datasets'> & IVisListTableProps, keyof ICompRouter | 'onChange'>;
}

export default class VisFilterTable extends Component<IFilterTableProps, {}> {
  Table: ReactNode = null;
  Filter: ReactNode = null;
  state = {
    zanQueries: Object.create(null),
  };

  handleFilterSubmit: IVisListFilterProps['onSubmit'] = value => {
    const isZanQueriesEqual = isEqual(this.state.zanQueries, value);
    if (isZanQueriesEqual) {
      if (this.Table) {
        (this.Table as any).refetchData.refresh();
      }
    } else {
      this.setState({ zanQueries: value });
    }
  };

  handleFilterChange: IVisListFilterProps['onChange'] = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        filterChange: value,
        tableChange: Object.create(null),
      });
    }
  };

  handleTableChange: IVisListTableProps['onChange'] = conf => {
    const { onChange } = this.props;
    const { zanQueries } = this.state;
    if (onChange) {
      onChange({
        filterChange: zanQueries,
        tableChange: conf,
      });
    }
  };

  render() {
    const { location, push, filterProps, tableProps } = this.props;
    const router = { location, push };
    return (
      <>
        <VisFilter
          {...router}
          {...filterProps}
          ref={FilterRef => (this.Filter = FilterRef)}
          onChange={this.handleFilterChange}
          onSubmit={this.handleFilterSubmit}
        />
        <VisTable
          {...router}
          ref={TableRef => (this.Table = TableRef)}
          {...tableProps}
          zanQueries={this.state.zanQueries}
          onChange={this.handleTableChange}
        />
      </>
    );
  }
}
