import { React, createBlock } from '@youzan/tany-react';
import { EasyList } from '@youzan/ebiz-components';
import StudentListModel, { AssignmentListModelType } from '../../models/student-list';
import ExportActions from 'components/export-actions';
import { WORKBOOK_STUDENT_EXPORT_TYPE } from '../../../../constants';

const { List, EasyGrid, Filter } = EasyList;

const LIST_PAGE_SIZE = 10;

const WorkbookStudentList = (studentListModel: AssignmentListModelType) => {
  const {
    filterConfig,
    columns,
    listRef,
    filterRef,
    emptyLabel,
    fetchWorkbookStudentList,
    handleWorkbookStudentExport,
    workbookKdtId,
  } = studentListModel;

  return (
    <List
      mode="none"
      onSubmit={fetchWorkbookStudentList as any}
      ref={listRef}
      defaultFilter={{ pageSize: LIST_PAGE_SIZE }}
      delay={500}
    >
      <Filter
        ref={filterRef}
        config={filterConfig as any} // todo
        actionsOption={{
          beforeReset(filter) {
            return (
              workbookKdtId === _global.kdtId
                ? <ExportActions
                  samName="编辑"
                  withAgreementConfirm
                  onExport={() => handleWorkbookStudentExport(filter)}
                  type={WORKBOOK_STUDENT_EXPORT_TYPE}
                />
                : null
            );
          },
        }}
      />
      <EasyGrid
        columns={columns as any} // todo
        rowKey="mobile"
        scroll={{ x: 1200 }}
        emptyLabel={emptyLabel}
      />
    </List>
  );
};
export default createBlock({
  root: WorkbookStudentList,
  model: StudentListModel,
});
