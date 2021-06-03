import React, { FC, useEffect, useState } from 'react';
import { Tabs } from 'zent';
import FilterList from './list';
import { getRiskLockAPI } from '../../api/pct/risk-lock';
import AddLiveList from './components/add-live-list';
import VideoRecord from './components/video-record';
import { CampusProvider } from 'components/campus-filter/campus-provider';
import { TempAlertInfo } from '@youzan/ebiz-components';

import './style.scss';

const { TabPanel } = Tabs;
const { IOSBuyAlert } = TempAlertInfo;
enum ActiveId {
  list,
  record,
}

const tabType = _global.isYZEdu ? 'normal' : 'card';
const divideItems = [
  {
    text: '总部',
    kdtId: _global.kdtId,
  },
];

const App: FC = () => {
  const [activeKey, setActiveKey] = useState(ActiveId.list);
  const [isRiskLock, setRiskLock] = useState(false);

  useEffect(() => {
    getRiskLockAPI().then((data = {}) => {
      setRiskLock(!!Number(data.onoff || 0));
    });
  }, []);

  return (
    <CampusProvider divideItems={divideItems}>
      <div className="pct-live-list-wrapper">
        {_global.isYZEdu && <IOSBuyAlert />}
        <div className="pct-live-list">
          <Tabs activeId={activeKey} onChange={setActiveKey} type={tabType} unmountPanelOnHide>
            <TabPanel tab="直播列表" id={ActiveId.list}>
              <AddLiveList isLock={isRiskLock} />
              <FilterList />
            </TabPanel>
            <TabPanel tab="视频直播统计" id={ActiveId.record}>
              <VideoRecord />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </CampusProvider>
  );
};

export default App;
