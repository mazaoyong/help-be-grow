import React, { Component } from 'react';
import { Link } from 'react-router';
import switchBreadcrumb from 'fns/switch-breadcrumb';
import { Icon, Notify } from 'zent';
import { DisplayBoard } from '@youzan/react-components';

import PunchBoard from './components/PunchBoard';
import TaskList from './components/TaskList';
import { getPunchStatisticsAPI } from './api';

const data = {
  keys: ['浏览人数', '参与人数', '打卡总数', '打卡完成率'],
};

export default class DetailPage extends Component {
  state = {
    gciAlias: this.props.params.alias,
    boardData: {
      name: '',
      coverUrl: '',
      proceedStatus: 0, // 打卡状态
      completeRatio: 0, // 打卡完成率
      focusCount: 0, // 新增关注公众号人数
      gciTimes: 0, // 打卡次数
      joinPersonNum: 0, // 参数人数
      selectionGciTimes: 0, // 精选打卡次数
      participateWay: 0, // 参与方式
      participatePrice: 0, // 价格
    },
    statistics: ['-', '-', '-', '-'],
  };

  componentDidMount() {
    switchBreadcrumb('打卡详情', 'v4/vis/pct/page/tabs#/punch');
    this.getPunchStatistics();
  }

  getPunchStatistics = () => {
    getPunchStatisticsAPI(this.props.params.alias)
      .then(res => {
        const boardData = Object.assign({}, this.state.boardData, res);

        const statistics = [
          res.visitorCount || '-',
          res.joinPersonNum || '-',
          res.gciTimes || '-',
          res.completeRatio ? `${(res.completeRatio * 100).toFixed(1)}%` : '-',
        ];

        this.setState({
          boardData,
          statistics,
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      });
  };

  render() {
    const { gciAlias, boardData, statistics } = this.state;
    return (
      <div className="punch-detail">
        <PunchBoard
          gciAlias={gciAlias}
          data={boardData}
          showOperate
          onChange={() => this.getPunchStatistics()}
        />
        <div className="split-title">
          <i className="split" />
          <h3>打卡数据</h3>
          <Link className="link cursor-link" to={`/statistics/${gciAlias}`}>
            <Icon type="chart" />
            &nbsp;查看全部数据
          </Link>
        </div>
        <DisplayBoard
          className="pct-display-board"
          keys={data.keys}
          values={statistics}
          onChange={() => {
            this.getPunchStatistics();
          }}
        />
        <div className="split-title">
          <i className="split" />
          <h3>打卡任务</h3>
        </div>
        <TaskList gciAlias={this.props.params.alias} />
      </div>
    );
  }
}
