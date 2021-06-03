import { React, createBlock } from '@youzan/tany-react';
import { EasyList } from '@youzan/ebiz-components';

import { tabs } from '../../../constants';
import assignmentListModel, { AssignmentListModelType } from './models/workbook-assignment-list';

import './styles.scss';

const { List, Filter, Tabs, EasyGrid } = EasyList;

const LIST_PAGE_SIZE = 10;

const StudentAssignmentList = (StudentAssignmentListModel: AssignmentListModelType) => {
  const {
    userName,
    listRef,
    onGetWorkbookAssignmentList,
    config,
    workbookAssignmentListColumn,
    isFilterEmpty,
  } = StudentAssignmentListModel;

  return (
    <div className="student-assignment__list">
      <h2>{userName ? `${userName}的作业` : 'TA的作业'}</h2>
      <List
        ref={listRef}
        onSubmit={onGetWorkbookAssignmentList as any}
        defaultFilter={{ pageSize: LIST_PAGE_SIZE }}
        delay={500}
      >
        <Filter key="filter" config={config as any} />
        <Tabs
          name="status"
          tabs={tabs}
          defaultValue="0"
        />
        <EasyGrid
          columns={workbookAssignmentListColumn as any}
          rowKey="id"
          scroll={{ x: 1111 }}
          emptyLabel={isFilterEmpty && <span>暂无数据</span>}
        />
      </List>
    </div>
  );
};

export default createBlock({
  root: StudentAssignmentList,
  model: assignmentListModel,
});
