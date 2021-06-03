// import { BreadcrumbNav } from '@youzan/react-components';
import { Tabs } from 'zent';
import React, { FC, useCallback, useState } from 'react';
import AddCardsTab from './components/add-card-tabs';
import { REWARDS_TYPE } from './constants';
import RewardsList from './containers/RewardsListPage';
import { hashHistory } from 'react-router';
import { isEduBranchStore } from '@youzan/utils-shop';
import './style.scss';

const TabPanel = Tabs.TabPanel;

const TabWrapper:FC<{}> = () => {
  const { query = {} } = hashHistory.getCurrentLocation();
  const [currentId, setCurrentId] = useState<string>(query.type as any || REWARDS_TYPE[1]);
  const onTabChange = useCallback((id) => {
    window.history.pushState({}, document.title, window.location.href.split('?')[0]);
    setCurrentId(id);
  }, []);

  return (
    <div>
      <div className={'reward-list__title'}>奖励</div>
      { !isEduBranchStore && <AddCardsTab/>}
      <Tabs className="reward-list__tab" activeId={currentId} onChange={(id) => onTabChange(id)} type={'normal'}>
        <TabPanel tab="消课奖励" id={REWARDS_TYPE[1]}>
          {/* <RewardsList rewardNodeType={REWARDS_TYPE[1]} /> */}
        </TabPanel>
        <TabPanel tab="入学奖励" id={REWARDS_TYPE[0]}>
          {/* <RewardsList rewardNodeType={REWARDS_TYPE[0]} /> */}
        </TabPanel>
        <TabPanel tab="毕业奖励" id={REWARDS_TYPE[2]}>
        </TabPanel>
      </Tabs>
      <RewardsList rewardNodeType={currentId} />
    </div>
  );
};

export default TabWrapper;
