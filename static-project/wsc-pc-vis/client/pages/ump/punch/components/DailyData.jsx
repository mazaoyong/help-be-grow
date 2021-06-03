// 每日数据
import React, { Component } from 'react';
import { Notify } from 'zent';
import { Table } from '@zent/compat';

import { getPunchDailyDataAPI } from '../api';

export default class DailyData extends Component {
  state = {
    tableLoading: true,
    datasets: [],
    orderBy: 'taskDate',
    order: 'desc',
    size: 10,
    page: 1,
    total: 0,
  };

  componentDidMount() {
    if (this.props.gciId !== '') {
      this.getPunchDailyData();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gciId === '' && this.props.gciId !== '') {
      this.getPunchDailyData(1);
    }
  }

  onTableChange = ({ sortBy, sortType, current }) => {
    this.setState(
      {
        orderBy: sortBy || this.state.orderBy,
        order: sortType || this.state.order,
        tableLoading: true,
      },
      () => {
        this.getPunchDailyData(current);
      }
    );
  };

  getPunchDailyData(current) {
    const { order, orderBy, page, size } = this.state;

    getPunchDailyDataAPI({
      gciId: this.props.gciId,
      page: current || page,
      size,
      order,
      orderBy,
    })
      .then(({ content, pageable: { pageNumber }, total }) => {
        this.setState({
          datasets: content,
          page: pageNumber,
          total,
        });
      })
      .catch(msg => {
        Notify.error(msg || '获取学员数据失败！');
      })
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  getColumns() {
    return [
      {
        title: '日期',
        name: 'taskDate',
        needSort: true,
        bodyRender: item => {
          return item.taskDate;
        },
      },
      {
        title: '任务名称',
        name: 'name',
        bodyRender: item => {
          return item.name || '-';
        },
      },
      {
        title: '打卡次数',
        name: 'gciTimes',
      },
      {
        title: '补打次数',
        name: 'repairGciTimes',
      },
      {
        title: '点赞数',
        name: 'praiseNum',
      },
    ];
  }

  render() {
    const { tableLoading, datasets, page, size, total, order, orderBy } = this.state;

    return (
      <Table
        columns={this.getColumns()}
        loading={tableLoading}
        datasets={datasets}
        sortBy={orderBy}
        sortType={order}
        pageInfo={{
          current: page,
          pageSize: size,
          totalItem: total,
        }}
        onChange={this.onTableChange}
        emptyLabel="还没有每日数据"
      />
    );
  }
}
