import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Tabs, Notify, Alert, Icon } from 'zent';
import { UmpAppBoard } from '@youzan/react-components';
import get from 'lodash/get';
import cx from 'classnames';
import API from '../api';

const { getCommentCount, getWarning, ignoreAll, checkLiveAuth } = API;

const { TabPanel } = Tabs;
const appid = window._global.pctStatus.appId;
// 是否为微信服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;
// 是否显示为独立页面状态(服务于有赞教育，隐藏顶部tab等相关信息)
const isPageMode = get(window._global, 'isYZEdu');

class App extends Component {
  constructor() {
    super();
    this.state = {
      type: 'content',
      unreadCount: 0,
      warningCount: 0,
      isLiveAuth: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (get(nextProps, 'routes[1].path') !== prevState.type) {
      return { type: get(nextProps, 'routes[1].path') };
    }
    return null;
  }

  componentDidMount() {
    getCommentCount()
      .then(count => {
        if (count > 0) {
          this.setState({
            unreadCount: count,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg || '获取留言总数失败');
      });
    this.getWarning();
  }

  getWarning = () => {
    getWarning()
      .then(count => {
        if (count !== this.state.warningCount) {
          this.setState({
            warningCount: count,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg || '获取异常失败');
      });
    checkLiveAuth().then(isLiveAuth => {
      if (!isLiveAuth) {
        this.setState({
          isLiveAuth,
        });
      }
    });
  };

  onTabChange = id => {
    if (['gpunch'].indexOf(id)) {
      hashHistory.push(`/list/${id}`);
    }
    window.location.href = `${_global.url.wsc}/paidcontent/content#/list/${id}`;
  };

  clearWarning = () => {
    this.setState({
      warningCount: 0,
    });
  };

  ignoreAll = () => {
    ignoreAll()
      .then(() => {
        this.clearWarning();
      })
      .catch(msg => {
        Notify.error(msg || '请求失败');
      });
  };

  render() {
    const { type, warningCount, unreadCount } = this.state;
    const tabClassName = cx({
      'big-tab': true,
      'has-unread': unreadCount > 0,
    });

    return (
      <div className={isPageMode ? 'page-mode' : ''}>
        {!isMpAccount && (
          <Alert type="warning" closable className="mp-account-warning">
            你的店铺尚未绑定认证服务号，为了保证功能完整，请点击“
            <a
              href={`${_global.url.www}/setting/wxsettled#step_1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              此处
            </a>
            ”去配置或升级为
            <strong>认证服务号</strong>
            绑定。
            <a
              href="https://help.youzan.com/qa?scene_id=4#/menu/13938/detail/4-2-13067?_k=j4rp0h"
              target="_blank"
              rel="noopener noreferrer"
            >
              了解详情
            </a>
          </Alert>
        )}

        {isPageMode ? null : <UmpAppBoard id={appid} title="知识付费" versionText="（高级版）" />}

        {warningCount > 0 && type === 'column' && (
          <Alert
            className="global-warning-tip"
            size="large"
            type="warning"
            closable
            onClose={this.clearWarning}
            rounded
          >
            <span>
              你有
              {warningCount}
              个专栏被供货商修改了价格或下架，请及时查看
            </span>
            <a className="global-warning-tip__ignore-action" onClick={this.ignoreAll}>
              忽略全部消息
            </a>
          </Alert>
        )}
        <div className="global-tab-wrap">
          <Tabs className={tabClassName} activeId={type} onChange={this.onTabChange}>
            <TabPanel id="content" tab="内容" />
            <TabPanel id="live" tab="直播" />
            <TabPanel id="column" tab="专栏" />
            <TabPanel id="gpunch" tab="群打卡" />
            <TabPanel id="ump" tab="营销" />
            {!_global.isSuperStore ? <TabPanel id="benefit" tab="会员权益" /> : ''}
            <TabPanel id="interactive" tab="互动" />
            <TabPanel id="paidrecords" tab="订购记录" />
          </Tabs>

          {isPageMode ? null : (
            <a
              className="global-tab-wrap__setting-action"
              onClick={() => hashHistory.push('/setting')}
            >
              <Icon type="settings" className="setting-icon" />
              设置
            </a>
          )}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
