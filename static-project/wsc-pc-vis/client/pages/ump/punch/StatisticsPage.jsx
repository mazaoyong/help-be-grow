// 打卡数据页面
import React, { Component } from 'react';
import { Button, Tabs, Notify } from 'zent';

import switchBreadcrumb from 'fns/switch-breadcrumb';
import { DisplayBoard } from '@youzan/react-components';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import StudentData from './components/StudentData';
import DailyData from './components/DailyData';

import { getPunchStatisticsAPI, exportData } from './api';
import { STATISTICS_TABS } from './constants';

const data = {
  keys: ['浏览人数', '参与人数', '打卡总数', '打卡完成率', '精选打卡总数'],
};

export default class StatisticsPage extends Component {
  state = {
    activeTab: 'student',
    gciId: '',
    statistics: ['-', '-', '-', '-', '-'],
  };

  componentDidMount() {
    switchBreadcrumb('打卡数据', 'v4/vis/pct/page/tabs#/punch');
    this.getPunchStatistics();
  }

  onTabChange = id => {
    this.setState({
      activeTab: id,
    });
  };

  // 查询统计数据
  getPunchStatistics = () => {
    getPunchStatisticsAPI(this.props.params.alias)
      .then(res => {
        const statistics = [
          res.visitorCount || '-',
          res.joinPersonNum || '-',
          res.gciTimes || '-',
          res.completeRatio ? `${(res.completeRatio * 100).toFixed(1)}%` : '-',
          res.selectionGciTimes || '-',
        ];

        this.setState({
          statistics,
          gciId: res.id,
        });
      })
      .catch(msg => {
        Notify.error(msg || '获取打卡数据失败！');
      });
  };

  exportData = () => {
    const req = {
      gciAlias: this.props.params.alias,
      type: this.state.activeTab === 'student' ? 2 : 3, // 导出类型 2 学员数据 3 每日数据
    };

    exportData(req)
      .then(() => {
        Notify.success('导出成功！');
        this.jumpToExportRecord();
      })
      .catch(() => {
        Notify.error('导出失败！');
      });
  };

  jumpToExportRecord = () => {
    window.open(getExportRecordUrl({
      type: this.state.activeTab === 'student' ? EXPORT_RECORD_TYPES.PUNCH_STUDENT
        : EXPORT_RECORD_TYPES.PUNCH_DAILY
    }));
  }

  renderContent() {
    const contents = {
      student: <StudentData gciId={this.state.gciId} />,
      daily: <DailyData gciId={this.state.gciId} />,
    };

    return contents[this.state.activeTab];
  }

  render() {
    return (
      <div className="punch-statistics">
        <div className="split-title">
          <i className="split" />
          <h3>打卡数据</h3>
        </div>
        <DisplayBoard
          className="pct-display-board"
          keys={data.keys}
          values={this.state.statistics}
        />
        <div className="list-filter clearfix">
          <Button type="primary" outline onClick={this.exportData}>
            批量导出
          </Button>
          <span className="cursor-link" onClick={this.jumpToExportRecord}>
            导出记录
          </span>
        </div>
        <Tabs
          activeId={this.state.activeTab}
          onChange={id => this.onTabChange(id)}
          tabs={STATISTICS_TABS}
        />
        {this.renderContent()}
      </div>
    );
  }
}
