import { React, createBlock, ModelOf } from '@youzan/tany-react';
import { Tabs } from 'zent';
import WorkbookSummary from './blocks/summary';
import HomeworkList from './blocks/homework-list';
import StudentList from './blocks/student-list';
import WorkbookSummaryModel from './models/workbook-summary';

import { WorkbookManageViewType } from '../../constants';

import './styles.scss';

const { TabPanel } = Tabs;

const ManagePage = (model: ModelOf<typeof WorkbookSummaryModel>) => {
  const { viewType, onViewTypeChange } = model;

  return (
    <div className="workbook-manage">
      <WorkbookSummary />
      <Tabs
        className="workbook-manage__list-container"
        activeId={viewType}
        onChange={onViewTypeChange}
        unmountPanelOnHide
      >
        <TabPanel tab="作业列表" id={WorkbookManageViewType.HOMEWORKS}>
          <HomeworkList />
        </TabPanel>
        <TabPanel tab="学员列表" id={WorkbookManageViewType.STUDENTS}>
          <StudentList />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default createBlock({
  root: ManagePage,
  model: WorkbookSummaryModel,
});
