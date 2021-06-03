import React, { PureComponent } from 'react';
import { getScheduleProfile, getScheduleStatistic, getEduConfig } from './api';
import { Notify, Tabs } from 'zent';
import './styles.scss';
import Pannel from './pannel';
import List from './list';
import { withRouter } from 'react-router';
import { Moments } from '@ability-center/supv/moments';
const TabPanel = Tabs.TabPanel;

class Detail extends PureComponent {
  state = {
    profile: {},
    statistics: {
      studentNum: 0,
      trialNum: 0,
      attendNum: 0,
      leaveNum: 0,
      absentNum: 0,
    },
    settings: {},
    activeId: 'student_list',
  };

  componentDidMount() {
    this.getProfile();
    this.getStatistic();
    this.getSettings();
    window.Logger && window.Logger.log({
      et: 'custom', // 事件类型
      ei: 'vis_schedule_detail', // 事件标识
      en: '访问日程详情页', // 事件名称
      params: {
        operator_source: 'wsc-pc-vis',
      }, // 事件参数
    });
  }

  getLessonNo() {
    if (this.lessonNo === undefined) {
      const { lessonNo } = this.props.location.query || {};
      this.lessonNo = lessonNo || 0;
    }
    return this.lessonNo;
  }

  getKdtId() {
    if (this.kdtId === undefined) {
      const { kdtId } = this.props.location.query || {};
      this.kdtId = kdtId || 0;
    }
    return this.kdtId;
  }

  getProfile = () => {
    const lessonNo = this.getLessonNo();
    const kdtId = this.getKdtId();
    return getScheduleProfile({ lessonNo, kdtId })
      .then(data => {
        this.setState({ profile: data });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  getStatistic() {
    const lessonNo = this.getLessonNo();
    const kdtId = this.getKdtId();
    getScheduleStatistic({ lessonNo, kdtId })
      .then(data => {
        this.setState({
          statistics: data || {},
        });
      })
      .catch(err => Notify.error(err));
  }

  getSettings() {
    getEduConfig()
      .then(data => {
        this.setState({
          settings: data,
        });
      })
      .catch(err => Notify.error(err));
  }

  afterAction = () => {
    this.getProfile();
    this.getStatistic();
  }

  onTabChange = id => {
    this.setState({
      activeId: id,
    });
  };

  render() {
    const lessonNo = this.getLessonNo();
    const kdtId = this.getKdtId();
    const { profile, statistics, settings } = this.state;
    return (
      <div className="schedule-detail">
        <div className="schedule-detail_pannel">
          <Pannel
            lessonNo={lessonNo}
            kdtId={kdtId}
            profile={profile}
            statistics={statistics}
            getData={this.afterAction}
          />
        </div>
        <div className="schedule-detail_list">
          <Tabs activeId={this.state.activeId} onChange={this.onTabChange} type="slider">
            <TabPanel tab="学员列表" id="student_list">
              <List
                lessonNo={lessonNo}
                kdtId={kdtId}
                profile={profile}
                statistics={statistics}
                settings={settings}
                afterAction={this.afterAction}
              />
            </TabPanel>
            <TabPanel tab="点评记录" id="moment_list">
              <Moments queryData={{ kdtId: profile.kdtId || kdtId, lessonNo }} type={1}/>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withRouter(Detail);
