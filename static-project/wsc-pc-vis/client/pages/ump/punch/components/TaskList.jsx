import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Button, Grid, Notify } from 'zent';
import Filter from '@ability-center/course/filter';
import isToday from 'fns/is-today';

import { PUNCH_TASK_OPTIONS } from '../constants';

import { getPunchTaskListAPI } from '../api';

export default class TaskList extends Component {
  static propTypes = {
    gciAlias: PropTypes.string.isRequired,
  };

  state = {
    tableLoading: true,
    filter: {
      searchDate: [],
      searchName: '',
      status: '',
    },
    datasets: [],
    pageSize: 10,
    current: 1,
    totalItem: 0,
    order: 'asc',
    orderBy: 'dayOffset',
  };

  componentDidMount() {
    this.getPunchTaskList();
  }

  onFilterChange = value => {
    this.setState({
      filter: value,
    });
  };

  onClear = () => {
    this.setState(
      {
        filter: {
          searchDate: [],
          searchName: '',
          status: '',
        },
      },
      () => {
        this.getPunchTaskList(1);
      }
    );
  };

  onTableChange = ({ sortBy, sortType, current }) => {
    this.setState(
      {
        orderBy: sortBy || this.state.orderBy,
        order: sortType || this.state.order,
      },
      () => {
        this.getPunchTaskList(current);
      }
    );
  };

  // 获取打卡任务列表
  getPunchTaskList = current => {
    this.setState({
      tableLoading: true,
    });

    const {
      filter: { searchDate, searchName, status },
      order,
      orderBy,
    } = this.state;

    let req = {
      page: current || this.state.current,
      size: this.state.pageSize,
      gciAlias: this.props.gciAlias,
      order,
      orderBy,
    };

    if (status !== '') {
      req.status = status;
    }

    if (searchName !== '') {
      req.searchName = searchName;
    }

    if (searchDate[0]) {
      req.searchStartDate = searchDate[0];
    }

    if (searchDate[1]) {
      req.searchEndDate = searchDate[1];
    }

    getPunchTaskListAPI(req)
      .then(({ content = [], total = 0, pageable = { pageNumber: 1, pageSize: 10 } }) => {
        const { pageNumber, pageSize } = pageable;

        this.setState({
          datasets: content,
          current: pageNumber,
          pageSize,
          totalItem: total,
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      })
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  };

  getColumns() {
    return [
      {
        name: 'dayOffset',
        title: '天数',
        needSort: true,
        width: '20%',
        bodyRender: item => {
          return `第${item.dayOffset}天`;
        },
      },
      {
        name: 'name',
        title: '任务名称',
        width: '20%',
        bodyRender: item => {
          return item.name || '-';
        },
      },
      {
        name: 'taskDate',
        title: '日期',
        width: '20%',
        bodyRender: item => {
          const today = isToday(item.taskDate) ? '（今天）' : '';
          return item.taskDate + today;
        },
      },
      {
        name: 'taskGciTimes',
        title: '打卡数',
        width: '20%',
      },
      {
        title: '操作',
        width: '20%',
        textAlign: 'right',
        bodyRender: item => {
          return (
            <div>
              <Link className="ui-link--split" to={`/task/${item.id}`}>
                {item.name === '' ? '设置任务' : '编辑'}
              </Link>
              <Link
                className="ui-link--split"
                to={`/diary/${this.props.gciAlias}?activeDay=${item.dayOffset}`}
              >
                打卡日记
              </Link>
            </div>
          );
        },
      },
    ];
  }

  render() {
    const { tableLoading, datasets, current, pageSize, totalItem, order, orderBy } = this.state;

    return (
      <div>
        <Filter
          options={PUNCH_TASK_OPTIONS}
          value={this.state.filter}
          onChange={this.onFilterChange}
          onSubmit={() => this.getPunchTaskList(1)}
        >
          <Button type="primary" onClick={() => this.getPunchTaskList(1)}>
            筛选
          </Button>
          <span className="cursor-link filter-clear" onClick={() => this.onClear()}>
            重置筛选条件
          </span>
        </Filter>
        <Grid
          columns={this.getColumns()}
          loading={tableLoading}
          datasets={datasets}
          sortBy={orderBy}
          sortType={order}
          pageInfo={{
            current,
            pageSize,
            totalItem,
          }}
          onChange={conf => {
            this.onTableChange(conf);
          }}
        />
      </div>
    );
  }
}
