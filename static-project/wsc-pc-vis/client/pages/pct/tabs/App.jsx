import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Tabs, Notify, Alert } from 'zent';
import { UmpAppBoardV2 } from '@youzan/react-components';
import withIntro from '@youzan/intro';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import get from 'lodash/get';
import cx from 'classnames';
import { TempAlertInfo } from '@youzan/ebiz-components';
import API from './api';
import { visPush } from 'fns/router';

import { TabsConfig } from './config';
import eventEmit from './event';

const { getWarningV2, ignoreAllV2, checkLiveAuth } = API;
const { IOSBuyAlert, PunchAlert } = TempAlertInfo;
const { TabPanel } = Tabs;
const appid = window._global.pctStatus.appId;
const expireTime = window._global.pctStatus.expireTime || 0;
/** 知识付费插件是否已过期 */
const isKnowledgePaidPluginExpired = expireTime - Date.now() <= 0;
// 是否为微信服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;

const options = {
  steps: [],
  nextLabel: '知道了',
};

// 处理需要展示intro的信息
const needIntros = TabsConfig.filter(i => !!i.intro);
// 获取已经展示过的引导信息
const shownIntro = JSON.parse(YZLocalStorage.getItem('pct_intro')) || [];
needIntros.forEach(({ path, intro }) => {
  if (shownIntro && Array.isArray(shownIntro)) {
    const shown = shownIntro.findIndex(i => i === path) > -1;
    if (!shown) {
      options.steps.push({
        element: `.zent-tabs-tab[aria-labelledby$=${path}]`,
        title: '',
        text: '',
        ...intro,
      });
    }
  }
});

// intro引导的hack方法，用于在tabs加载完成之后加载引导
const Hack = ({ children }) => <React.Fragment>{children}</React.Fragment>;
options.onComplete = () => {
  needIntros.forEach(({ path }) => {
    shownIntro.push(path);
  });
  YZLocalStorage.setItem('pct_intro', JSON.stringify([...new Set(shownIntro)]));
};
const Intro = withIntro(options, Hack);

const AlertHint = ({ type }) => {
  switch (type) {
    case 'punch':
      return <PunchAlert />;
    case 'order':
      return (
        <Alert type="warning" style={{ marginBottom: 10 }}>
          信息采集功能只在知识付费插件内可使用，该插件到期后则无法使用。
        </Alert>
      );
    default:
      return <IOSBuyAlert />;
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      type: 'content',
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
    this.getWarning();

    // 刷新数据
    eventEmit.on('refresh', () => {
      this.getWarning();
    });
  }

  handleTabChange = id => {
    hashHistory.push(id);
  };

  getWarning = () => {
    getWarningV2()
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

  clearWarning = () => {
    this.setState({
      warningCount: 0,
    });
  };

  ignoreAll = () => {
    ignoreAllV2()
      .then(() => {
        this.clearWarning();
        window.location.reload();
      })
      .catch(msg => {
        Notify.error(msg || '请求失败');
      });
  };

  render() {
    const { type, warningCount } = this.state;
    const tabClassName = cx({
      'big-tab': true,
    });

    return (
      <div>
        <div className="market-wrapper">
          <UmpAppBoardV2 id={appid} title="知识付费" />
        </div>
        {
          /**
           * 当知识付费插件到期时，其他类型的提醒均不再提示
           * See: https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=78120
           */
          !isKnowledgePaidPluginExpired && (
            <>
              <AlertHint type={type} />
              {!isMpAccount && (
                <Alert type="warning" closable className="mp-account-warning">
                  你的店铺尚未绑定认证服务号，为了保证功能完整，请点击“
                  <a
                    href={`${window._global.url.www}/setting/wxsettled#step_1`}
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
            </>
          )
        }

        <div className="global-tab-wrap">
          <Tabs
            className={tabClassName}
            activeId={type}
            onChange={this.handleTabChange}
            navExtraContent={
              <a
                className="global-tab-wrap__setting-action"
                onClick={() => visPush('/settings/setting')}
              >
                设置
              </a>
            }
          >
            {TabsConfig.map(({ path, name }) => (
              <TabPanel key={path} id={path} tab={name} />
            ))}
          </Tabs>
          {options.steps.length > 0 && <Intro />}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
