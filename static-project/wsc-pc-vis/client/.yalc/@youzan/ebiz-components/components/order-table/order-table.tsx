import React, { Component } from 'react';
import { BlockLoading, Pagination } from 'zent';
import OrderTableBody from './components/order-table-body';
import OrderTableHeader from './components/order-table-header';
import { IORderTableProps, IDataStruct, IPageRequest } from './types';
import fromateColumns, { IFormatedCols } from './utils/columns-formate';
import { PaginationChangeHandler } from 'zent/es/pagination/impl/BasePagination';

interface IOrderTableState {
  renderConf: IFormatedCols;
  loading: boolean;
  selectNum: number;
  totalNumber: number;
  datasets: any[];
  selectedRows: number[];
  pageInfo: {
    total: number;
    current: number;
    pageSize: 20 | number;
  };
}

const noData = (emptyLabel: IORderTableProps['emptyLabel']) =>
  emptyLabel ? (
    emptyLabel()
  ) : (
    <tbody>
      <tr className="ebiz-order-table__empty-label">
        <td colSpan={99}>没有更多数据了</td>
      </tr>
    </tbody>
  );

class OrderTable extends Component<IORderTableProps, IOrderTableState> {
  constructor(props: IORderTableProps) {
    super(props);
    // 检查是否存在fetchData属性以及columns属性，如果没有这两个关键属性就报错
    if (!props.fetchData || !props.columns) {
      throw new Error('component order-table required properties fetch-data and columns');
    }

    this.state = {
      renderConf: fromateColumns(props.columns),
      loading: false,
      selectNum: 0,
      selectedRows: [],
      totalNumber: 0,
      datasets: [],
      pageInfo: {
        current: 1,
        total: 1,
        pageSize: props.pageSize || 20,
      },
    };
  }

  handlePageChange: PaginationChangeHandler = page => {
    const { zanQuery } = this.props;
    this.fetchingData(zanQuery, { pageNumber: page.current, pageSize: this.state.pageInfo.pageSize });
  };

  fetchingData = (zanQuery: any, pageRequest: IPageRequest) => {
    const { fetchData } = this.props;
    this.setState({ loading: true });
    fetchData(zanQuery, pageRequest)
      .then(({ datasets, total, current }: IDataStruct) => {
        const pageInfo = {
          current,
          total,
          pageSize: this.state.pageInfo.pageSize,
        };

        const { onDataChange } = this.props;
        if (onDataChange) {
          onDataChange(datasets);
        }
        this.setState({
          datasets,
          pageInfo,
          totalNumber: datasets.length,
          loading: false,
        });
      })
      .catch(() => this.setState({ loading: false }));
  };

  handleSelect = (selected: number, row: number) => {
    let { selectedRows } = this.state;
    const { datasets } = this.state;
    const { onSelect } = this.props;
    const hasDup = selectedRows.findIndex(i => i === row) > -1;
    if (hasDup) {
      selectedRows = selectedRows.filter(i => i !== row);
    } else {
      selectedRows.push(row);
    }
    this.setState({ selectNum: selected, selectedRows });
    if (onSelect) {
      const rows = selectedRows.map(row => datasets[row]);
      onSelect(rows);
    }
  };

  componentDidMount() {
    const { zanQuery } = this.props;
    const { pageInfo } = this.state;
    this.fetchingData(
      { ...zanQuery },
      {
        pageNumber: pageInfo.current,
        pageSize: pageInfo.pageSize,
      },
    );
  }

  // 如果前后zanQuery值不相同，要重置页数
  refreshData = (getFirstPage: boolean = false) => {
    const { zanQuery, pageSize } = this.props;
    const pageNumber = this.state.pageInfo.current || 1;
    this.fetchingData(zanQuery, { pageNumber: getFirstPage ? 1 : pageNumber, pageSize });
  };

  render() {
    const { renderConf, loading, selectNum, totalNumber, datasets, pageInfo } = this.state;
    const { selectable = false, extend, emptyLabel, batchComponent } = this.props;
    const getSelectStatus = (() => {
      if (selectNum > 0) {
        if (selectNum < totalNumber) {
          return { indeterminate: true, checked: false };
        }
        if (selectNum === totalNumber) {
          return { indeterminate: false, checked: true };
        }
      }
      return { indeterminate: false, checked: false };
    })();
    return (
      <BlockLoading loading={loading}>
        <table className="ebiz-order-table">
          <OrderTableHeader
            selectable={selectable}
            header={renderConf.bodyKeys}
            columns={renderConf.columns}
            selectStatus={getSelectStatus}
            onSelectAll={(status: boolean) =>
              this.setState({ selectNum: status ? totalNumber : 0 })
            }
          />
          {datasets.length ? (
            <OrderTableBody
              selectable={selectable}
              headKeys={renderConf.headKeys}
              bodyKeys={renderConf.bodyKeys}
              columns={renderConf.columns}
              datasets={datasets}
              selectAll={getSelectStatus}
              extend={extend}
              onSelectChange={this.handleSelect}
            />
          ) : noData(emptyLabel)}
        </table>
        <div className="ebiz-order-table__footer">
          {datasets.length && batchComponent ? (
            <div className="ebiz-order-table__footer-batchComp">
              <OrderTableHeader.CheckBox
                status={getSelectStatus}
                onSelect={(status: boolean) =>
                  this.setState({ selectNum: status ? totalNumber : 0 })
                }
              />
              {batchComponent}
            </div>
          ) : null}
          {datasets.length ? (
            <Pagination
              className="ebiz-order-table__footer-pagination"
              current={pageInfo.current}
              totalItem={pageInfo.total}
              pageSize={pageInfo.pageSize}
              onChange={this.handlePageChange}
            />
          ) : null}
        </div>
      </BlockLoading>
    );
  }
}

export default OrderTable;
