import React, { useState, FC } from 'react';

import { Tabs } from 'zent';

import Overview from './blocks/overview';
import Analysis from './blocks/analysis';
import Charts from './blocks/charts';
import Students from './blocks/students';

import './index.scss';

const { TabPanel } = Tabs;

type TTabsIds = 'charts' | 'analysis' | 'students';

const StatsPage: FC<{ params: { examTemplateId: string; } }> = ({ params }) => {
  const examTemplateId = Number(params.examTemplateId);
  const [currentTabId, setCurrentTabId] = useState<TTabsIds>('charts');
  return (
    <main className="statspage">
      <Overview examTemplateId={examTemplateId} />
      <section className="statspage__tabs">
        <Tabs
          type="card"
          activeId={currentTabId}
          onChange={setCurrentTabId}
        >
          <TabPanel tab="分数段统计" id="charts">
            <Charts examTemplateId={examTemplateId} />
          </TabPanel>
          <TabPanel tab="非问答题分析" id="analysis">
            <Analysis examTemplateId={examTemplateId}/>
          </TabPanel>
          <TabPanel tab="学员信息" id="students">
            <Students examTemplateId={examTemplateId}/>
          </TabPanel>
        </Tabs>
      </section>
    </main>
  );
};

export default StatsPage;
