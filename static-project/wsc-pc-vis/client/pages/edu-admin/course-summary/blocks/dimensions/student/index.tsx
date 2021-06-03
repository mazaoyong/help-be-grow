import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import ExportActions from 'components/export-actions';
import { useStudentSummaryModel } from 'pages/edu-admin/course-summary/models/dimensions/student';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { useOverrideStyle } from '@hooks';
import { wrapNotify } from 'pages/edu-admin/course-summary/components/wrap-notify';

import type { PageRouterWrapper } from 'fns/router';

import './styles.scss';

const { Filter, List, EasyGrid } = EasyList;
const overrideStyles = `
.app .app-inner {
  margin: 0 !important;
  background: transparent;
}`;

interface IStudentSummary {}
export const StudentSummary: React.FC<PageRouterWrapper<IStudentSummary>> = (props) => {
  const studentSummaryModel = useStudentSummaryModel(props);
  useOverrideStyle({ uniqueId: 'course-summary-student', overrideStyles });

  const renderExportBtn = React.useCallback(
    (filter: any) => (
      <ExportActions
        withAgreementConfirm
        onExport={() => studentSummaryModel.exportStudentList(filter)}
        type={EXPORT_RECORD_TYPES.COURSE_SUMMARY_STUDENT_DIMENSION}
      />
    ),
    [studentSummaryModel],
  );
  return (
    <div className="course-summary__student-list">
      <List
        mode="none"
        delay={200}
        defaultFilter={studentSummaryModel.defaultFilter}
        onError={wrapNotify.error}
        onSubmit={studentSummaryModel.fetchStudentSummaryList}
      >
        <Filter
          config={studentSummaryModel.filterConfig}
          actionsOption={{ beforeReset: renderExportBtn }}
        />
        <EasyGrid
          customColumns
          rowKey="studentId"
          scroll={{ x: 2000 }}
          columns={studentSummaryModel.gridConfig}
          customColumnsDialogTitle="配置课时汇总（按学员）表头"
        />
      </List>
    </div>
  );
};
