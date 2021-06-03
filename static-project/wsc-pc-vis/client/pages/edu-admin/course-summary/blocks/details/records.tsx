import React from 'react';
import { EasyList } from '@youzan/ebiz-components';
import formatMoney from '@youzan/utils/money/format';
import ExportActions from 'components/export-actions';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { useChainSettings } from '@hooks';

import { SummaryInfoBlock, ISummaryDataItem } from '../../components/summary-info-block';
import { useRecordsDetailModel } from '../../models/details/records';
import { wrapNotify } from '../../components/wrap-notify';

const { List, Filter, EasyGrid } = EasyList;

interface IRecordSummaryListProps {
  studentId?: any;
  assetNo?: any;
  /** 从学院维度|已报课程跳转 */
  pageType: 'student' | 'apply-list';
  defaultFilter: any;
}
const RecordSummaryList: React.FC<IRecordSummaryListProps> = (props) => {
  const { studentId, assetNo, defaultFilter } = props;
  const recordsDetailModel = useRecordsDetailModel({ userId: studentId, assetNo });
  const { courseSummaryExportability } = useChainSettings({});

  const renderExportBtn = React.useCallback(
    (filter: any) => {
      if (courseSummaryExportability !== 'invisible') {
        return (
          <ExportActions
            withAgreementConfirm
            disabled={courseSummaryExportability === 'disabled'}
            onExport={() => recordsDetailModel.exportRecordsDetail(filter)}
            type={EXPORT_RECORD_TYPES.SIGNIN_LIST}
          />
        );
      }
      return null;
    },
    [courseSummaryExportability, recordsDetailModel],
  );
  return (
    <List
      mode="none"
      onError={wrapNotify.error}
      defaultFilter={defaultFilter}
      delay={/** 延迟200ms加载，防止在filter未初始化完成时进行请求 */ 200}
      onSubmit={recordsDetailModel.fetchList}
    >
      <Filter
        config={recordsDetailModel.filterConfig}
        collapseConfig={recordsDetailModel.collapseConfig}
        actionsOption={{ beforeReset: renderExportBtn }}
      />
      <SummaryInfoBlock
        title="当前结果合计："
        loading={recordsDetailModel.loadingCollection.summaryInfo}
        infoList={infoListAdaptor(recordsDetailModel.recordsSummaryData)}
      />
      <EasyGrid
        rowKey="operateId"
        className="fixed-layout-table"
        customColumns
        customColumnsCacheKey="recordsSummary"
        scroll={{ x: 1900 }}
        columns={recordsDetailModel.gridConfig}
        customColumnsDialogTitle="配置上课记录表头"
      />
    </List>
  );
};

export default RecordSummaryList;
enum SummaryContain {
  CONSUME_COURSE = 'consumeNum',
  CONSUME_TUITION = 'consumeTuition',
}
const IconMap: Record<SummaryContain, string> = {
  consumeNum: 'classhour',
  consumeTuition: 'consumption',
};
const TitleMap: Record<SummaryContain, string> = {
  consumeNum: '上课消耗课时',
  consumeTuition: '上课消耗金额（元）',
};
function infoListAdaptor(infos: Record<SummaryContain, number>): ISummaryDataItem[] {
  return Object.entries(infos).map(([name, value]) => ({
    icon: IconMap[name],
    title: TitleMap[name],
    content: formatMoney(value),
  }));
}
