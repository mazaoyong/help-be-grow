import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import ExportActions from 'components/export-actions';
import { useApplyListSummaryModel } from 'pages/edu-admin/course-summary/models/dimensions/apply-list';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { useOverrideStyle } from '@hooks';

import type { PageRouterWrapper } from 'fns/router';

import './styles.scss';
import { wrapNotify } from 'pages/edu-admin/course-summary/components/wrap-notify';

const { Filter, List, EasyGrid } = EasyList;
const overrideStyles = `
.app .app-inner {
  margin: 0 !important;
  background: transparent;
}`;

interface IApplyListSummary {}
export const ApplyListSummary: React.FC<PageRouterWrapper<IApplyListSummary>> = (props) => {
  const applyListSummaryModel = useApplyListSummaryModel(props);
  useOverrideStyle({ uniqueId: 'course-summary-apply-list', overrideStyles });

  const renderExportBtn = React.useCallback(
    (filter: any) => (
      <ExportActions
        withAgreementConfirm
        onExport={() => applyListSummaryModel.exportApplyList(filter)}
        type={EXPORT_RECORD_TYPES.COURSE_SUMMARY_APPLY_COURSE_DIMENSION}
      />
    ),
    [applyListSummaryModel],
  );
  return (
    <div className="course-summary__apply-list">
      <List
        mode="none"
        delay={200}
        defaultFilter={applyListSummaryModel.defaultFilter}
        onError={wrapNotify.error}
        onSubmit={applyListSummaryModel.fetchApplyListSummary}
      >
        <Filter
          config={applyListSummaryModel.filterConfig}
          collapseConfig={applyListSummaryModel.filterCollapseConfig}
          actionsOption={{ beforeReset: renderExportBtn }}
        />
        <EasyGrid
          customColumns
          rowKey="assetNo"
          scroll={{ x: 2500 }}
          columns={applyListSummaryModel.gridConfig}
          customColumnsDialogTitle="配置课时汇总（按报读课程）表头"
        />
      </List>
    </div>
  );
};
