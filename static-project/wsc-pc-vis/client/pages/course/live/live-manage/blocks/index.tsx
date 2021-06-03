import qs from 'qs';
import React from 'react';
import { Tabs, Notify, ErrorBoundary } from 'zent';
import { hot } from 'react-hot-loader';

import { PopEllipsisText } from '@youzan/ebiz-components';
import { visitTracker } from 'components/logger';
import { arrayColumnWrapper } from 'fns/chain';
import { isBranchStore } from '@youzan/utils-shop';

import Stats from './stats';
import RecordManage from './record-manage';
import RoleManage from './role-manage';
import RoomSetting from './room-setting';
import RewardManage from './reward-manage';
import LiveSelling from './live-selling';
import LottoRecord from './lotto-record';

import NoBalanceHint from '../components/no-balance-hint';
import { ILiveManageEntryQuery, LiveManageHeaderTabs } from '../types';
import { checkVideoBalance, getLiveSetting } from '../../api/live-manage';

export interface ILiveManageParams extends ILiveManageEntryQuery {
  tab: keyof typeof LiveManageHeaderTabs;
}

const { TabPanel } = Tabs;
const queries = (qs.parse(location.search, {
  ignoreQueryPrefix: true,
}) as unknown) as ILiveManageParams;
const { title, alias, tab } = queries;
const defaultTab = LiveManageHeaderTabs[tab || 'SUMMARY'];

const LiveManageEntry: React.FC<{}> = () => {
  const [activeId, setActiveId] = React.useState<LiveManageHeaderTabs>(defaultTab);
  const [hasEnoughBalance, setBalanceState] = React.useState(false);
  const [showRoomSetting, setShowRoomSetting] = React.useState(true);
  const [hiddenTabs, setHiddenTabs] = React.useState([] as LiveManageHeaderTabs[]);

  const RoleManageTabContent = React.useMemo(
    () => (hasEnoughBalance ? '角色管理' : <TabPanelWithHint triggerContent="角色管理" />),
    [hasEnoughBalance],
  );
  const LiveRoomSettingTabContent = React.useMemo(
    () => (hasEnoughBalance ? '直播间设置' : <TabPanelWithHint triggerContent="直播间设置" />),
    [hasEnoughBalance],
  );

  const Panels = React.useMemo(
    () =>
      arrayColumnWrapper([
        {
          tabName: '学习统计',
          id: LiveManageHeaderTabs.SUMMARY,
          component: <Stats alias={alias} name={title} />,
        },
        {
          tabName: '回放管理',
          id: LiveManageHeaderTabs.RECORD_MANAGE,
          component: <RecordManage alias={alias} name={title} />,
        },
        {
          tabName: RoleManageTabContent,
          disabled: !hasEnoughBalance,
          id: LiveManageHeaderTabs.ROLE_MANAGE,
          component: <RoleManage alias={alias} name={title} />,
        },
        {
          tabName: LiveRoomSettingTabContent,
          disabled: !hasEnoughBalance && showRoomSetting,
          id: LiveManageHeaderTabs.LIVE_ROOM_SETTING,
          component: <RoomSetting alias={alias} name={title} />,
        },
        {
          tabName: '打赏管理',
          id: LiveManageHeaderTabs.REWARD_SETTING,
          component: <RewardManage alias={alias} name={title} />,
        },
        {
          tabName: '直播卖货',
          id: LiveManageHeaderTabs.LIVE_SELLING,
          component: <LiveSelling alias={alias} />,
        },
        {
          tabName: '抽奖记录',
          id: LiveManageHeaderTabs.LOTTO_RECORD,
          component: <LottoRecord alias={alias} />,
        },
      ])
        .filter((tab) => !hiddenTabs.includes(tab.id))
        .map((panelConfig) => {
          const { id, tabName, disabled, component } = panelConfig;
          return (
            <TabPanel key={id} id={id} tab={tabName} disabled={disabled}>
              {component}
            </TabPanel>
          );
        }),
    [RoleManageTabContent, hasEnoughBalance, LiveRoomSettingTabContent, hiddenTabs, showRoomSetting],
  );

  React.useEffect(() => {
    visitTracker({ pageType: 'liveManage' });
    checkVideoBalance()
      .then((response) => setBalanceState(response.success))
      .catch(Notify.error);
  }, []);

  // hotfix: 获取是否需要展示
  React.useEffect(() => {
    getLiveSetting({ alias })
      .then(({ openPureRtc }) => {
        setShowRoomSetting(!openPureRtc);
        if (openPureRtc) setHiddenTabs([LiveManageHeaderTabs.LIVE_ROOM_SETTING]);
      })
      .catch(Notify.error);
  }, []);

  return (
    <ErrorBoundary>
      <div className="live-manage__container">
        <div className="live-manage__header">
          <PopEllipsisText text={title} count={40} tagName="h1" />
        </div>
        <Tabs
          className="live-manage__tabsContainer"
          activeId={activeId}
          onChange={(v) => setActiveId(v)}
          unmountPanelOnHide
        >
          {Panels}
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default hot(module)(LiveManageEntry);

const TabPanelWithHint: React.FC<{
  triggerContent: React.ReactElement | string;
}> = ({ triggerContent }) => {
  const redirectUrl = React.useMemo(
    () => `${_global.url.v4}/subscribe/appmarket/appdesc?id=50190`,
    [],
  );

  return (
    <NoBalanceHint
      position="bottom-center"
      cancelText={isBranchStore ? undefined : '取消'}
      confirmText={isBranchStore ? '我知道了' : '立即充值'}
      onConfirm={() => !isBranchStore && window.open(redirectUrl)}
      hintContent={`你的视频直播剩余观看时长不足，无法进行直播间的管理和设置，${
        isBranchStore ? '请联系总部充值后继续使用' : '请充值后继续使用'
      }。`}
    >
      {triggerContent}
    </NoBalanceHint>
  );
};
