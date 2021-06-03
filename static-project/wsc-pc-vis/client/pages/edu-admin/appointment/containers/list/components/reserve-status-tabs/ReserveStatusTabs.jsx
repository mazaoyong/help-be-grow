import React, { Component } from 'react';
import { Tabs } from 'zent';
import { RESERVE_STATUS_TEXT } from '../../../../constants';
import { chainSupportChain } from '../../../../chain';

const TabPanel = Tabs.TabPanel;
const tabData = [{ text: '全部预约', status: 0 }, ...RESERVE_STATUS_TEXT];

const RESERVE_MAP = {
  1: 'toBeConfirmNum',
  2: 'performingNum',
  4: 'completedNum',
  5: 'cancelNum',
};
export default class ReserveStatusTabs extends Component {
  onTabChange = id => {
    this.props.changeStaus(id);
  };
  render() {
    const { statusCount, status } = this.props;
    return (
      <div className="reserve-status-tabs">
        <Tabs activeId={status} type='card' onChange={this.onTabChange}>
          {tabData.map((tab, index) => {
            let tabText = tab.text;
            // eslint-disable-next-line eqeqeq
            if (tab.status != 0) {
              const count = chainSupportChain ? '' : (statusCount[RESERVE_MAP[tab.status]] || 0);
              tabText = tabText + ' ' + count;
            }
            return <TabPanel key={index} id={tab.status} tab={tabText} />;
          })}
        </Tabs>
      </div>
    );
  }
}
