import React from 'react';
import ExportActions from 'components/export-actions';
import formatMoney from '@youzan/utils/money/format';
import { EasyList } from '@youzan/ebiz-components';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

import { SummaryInfoBlock, ISummaryDataItem } from '../../components/summary-info-block';
import { useManualConsumeModel } from '../../models/details/manual-consume';
import { wrapNotify } from '../../components/wrap-notify';

const { List, Filter, EasyGrid } = EasyList;

interface IManualConsumeProps {
  studentId?: any;
  assetNo?: any;
  /** 从学院维度|已报课程跳转 */
  pageType: 'student' | 'course';
  defaultFilter: any;
}
const ManualConsumeList: React.FC<IManualConsumeProps> = (props) => {
  const { studentId, assetNo, defaultFilter } = props;
  const manualConsumeDetailModel = useManualConsumeModel({ studentId, assetNo });

  const renderExportBtn = React.useCallback(
    (filter: any) => (
      <ExportActions
        withAgreementConfirm
        onExport={() => manualConsumeDetailModel.exportRecordsDetail(filter)}
        type={EXPORT_RECORD_TYPES.COURSE_SUMMARY_MANUAL_CONSUME}
      />
    ),
    [manualConsumeDetailModel],
  );
  return (
    <List
      mode="none"
      onError={wrapNotify.error}
      defaultFilter={defaultFilter}
      delay={/** 延迟200ms加载，防止在filter未初始化完成时进行请求 */ 200}
      onSubmit={manualConsumeDetailModel.fetchList}
    >
      <Filter
        config={manualConsumeDetailModel.filterConfig}
        actionsOption={{ beforeReset: renderExportBtn }}
      />
      <SummaryInfoBlock
        title="当前结果合计："
        loading={manualConsumeDetailModel.loadingCollection.summaryInfo}
        infoList={infoListAdaptor(manualConsumeDetailModel.manualConsumeSummaryData)}
      />
      <EasyGrid
        className="fixed-layout-table"
        rowKey="eventTime"
        scroll={{ x: 1900 }}
        columns={manualConsumeDetailModel.gridConfig}
        customColumnsDialogTitle="配置手动扣减表头"
      />
    </List>
  );
};

export default ManualConsumeList;

enum SummaryContain {
  MANUAL_CONSUME_COURSE = 'subNum',
  MANUAL_CONSUME_TUITION = 'subTuition',
}
const IconMap: Record<SummaryContain, string> = {
  subNum: 'classhour-hand',
  subTuition: 'consumption-hand',
};
const TitleMap: Record<SummaryContain, string> = {
  subNum: '手动扣减课时',
  subTuition: '手动扣减消耗金额（元）',
};
function infoListAdaptor(infos: Record<SummaryContain, number>): ISummaryDataItem[] {
  return Object.entries(infos).map(([name, value]) => ({
    icon: IconMap[name],
    title: TitleMap[name],
    content: formatMoney(value),
  }));
}
