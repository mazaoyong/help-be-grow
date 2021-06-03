import { React, createBlock, ModelOf } from '@youzan/tany-react';
import { EasyList } from '@youzan/ebiz-components';

import { tabs } from '../../../constants';
import AssignmentListModel from './models/assignment-list';

import './styles.scss';

const { List, Filter, InlineFilter, Tabs, EasyGrid, Search } = EasyList;

const LIST_PAGE_SIZE = 10;

const StudentAssignmentList = (model: ModelOf<typeof AssignmentListModel>) => {
  const {
    onGetHomeworkAssignmentList,
    homeworkTitle,
    reviewerConfig,
    homeworkAssignmentListColumn,
    isFilterEmpty,
  } = model;

  return (
    <div className="student-assignment__list">
      <List onSubmit={onGetHomeworkAssignmentList as any} defaultFilter={{ pageSize: LIST_PAGE_SIZE }} delay={500}>
        <InlineFilter
          left={
            <h1>{homeworkTitle}</h1>
          }
          right={[
            <Filter key="filter" config={[reviewerConfig] as any} backgroundColor="transparent" autoFilter />,
            <Search key="search" name="studentName" placeholder="搜索学员姓名" />,
          ]}
        />
        <Tabs name="status" tabs={tabs} defaultValue="0" />
        <EasyGrid
          columns={homeworkAssignmentListColumn as any}
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
  model: AssignmentListModel,
});
