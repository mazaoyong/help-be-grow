import React, { Component } from 'react';
import { Notify } from 'zent';
import { Table } from '@zent/compat';
import { Img } from '@youzan/ebiz-components';

import formatDate from 'zan-utils/date/formatDate';

import { getPunchStudentDataAPI } from '../api';

const { ImgWrap } = Img;
export default class StudentData extends Component {
  state = {
    tableLoading: true,
    datasets: [],
    orderBy: 'joinTime',
    order: 'desc',
    size: 10,
    page: 1,
    total: 0,
  };

  componentDidMount() {
    if (this.props.gciId !== '') {
      this.getPunchStudentData();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gciId === '' && this.props.gciId !== '') {
      this.getPunchStudentData(1);
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
        this.getPunchStudentData(current);
      }
    );
  };

  getPunchStudentData(current) {
    const { order, orderBy, page, size } = this.state;

    getPunchStudentDataAPI({
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
        title: '学员',
        name: 'avatar',
        bodyRender: item => {
          return <ImgWrap width="50px" height='50px' src={item.avatar} />;
        },
      },
      {
        title: '微信昵称',
        name: 'nickName',
      },
      {
        title: '打卡次数',
        name: 'gciTimes',
        needSort: true,
      },
      {
        title: '补打卡次数',
        name: 'repairGciTimes',
        needSort: true,
      },
      {
        title: '老师点评数',
        name: 'teacherCommentNum',
      },
      {
        title: '精选数',
        name: 'selectionNum',
      },
      {
        title: '报名时间',
        name: 'joinTime',
        needSort: true,
        bodyRender: item => {
          return formatDate(item.joinTime, 'YYYY-MM-DD HH:mm:ss');
        },
      },
    ];
  }

  render() {
    const { tableLoading, datasets, page, size, total, order, orderBy } = this.state;

    return (
      <Table
        className="student-table"
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
        emptyLabel="还没有学员数据"
      />
    );
  }
}
