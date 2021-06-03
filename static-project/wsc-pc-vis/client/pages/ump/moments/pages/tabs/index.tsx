import React from 'react';
import { VerticalTabs } from 'zent';
import { RouteComponentProps } from 'react-router';
import { UmpAppBoardV2 } from '@youzan/react-components';

interface TabsProps extends RouteComponentProps<{}, {}>{
  children: React.ElementType[];
}

const { TabPanel } = VerticalTabs;

const appid = 50189; // 家校圈appid

export const Tabs = ({ children, location, router }: TabsProps) => {
  const menuKey = location.pathname.split('/')[1];
  return (
    <div className="ump-moments">
      <div className="market-wrapper">
        <UmpAppBoardV2 id={appid} title="家校圈" />
      </div>
      <div className="moments-container">
        <VerticalTabs
          activeId={menuKey}
          onChange={id => router.push(id)}
          unmountPanelOnHide
        >
          <TabPanel tab="动态管理" id="management" />
          <TabPanel tab="设置" id="settings" />
        </VerticalTabs>
        <div className="moments-content">
          {children}
        </div>
      </div>
    </div>
  );
};
