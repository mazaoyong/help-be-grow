import React from 'react';
import { Notify } from 'zent';
import redirect from '@youzan/utils/url/redirect';
import ExportActions from 'components/export-actions';
import { EasyList, CardItem } from '@youzan/ebiz-components';
import { useOverrideStyle } from '@hooks';

import useSigninListModel from '../../models/list';
import './styles.scss';
import { EXPORT_RECORD_TYPES } from 'pages/ump/record/constants';

const overrideStyles = `
.app .app-inner {
  margin: 0 !important;
  background: transparent;
}
`;
const { Filter, List, EasyGrid } = EasyList;

interface ISigninAcceptData {}
export const SigninList: React.FC<ISigninAcceptData> = () => {
  const signinEditModel = useSigninListModel();
  useOverrideStyle({ uniqueId: 'signin', overrideStyles });

  const renderExportBtn = React.useCallback(
    (filter: any) => (
      <ExportActions
        withAgreementConfirm
        onExport={() => signinEditModel.handleExportSigninRecords(filter)}
        type={EXPORT_RECORD_TYPES.SIGNIN_LIST}
      />
    ),
    [signinEditModel],
  );
  return (
    <div className="signin-list__container">
      <CardItem
        className="signin-list__banner"
        rowData={{
          title: '签到记录',
          subtitle:
            '签到记录是学员每一次签到后的明细汇总，可用于学员到课情况、导出并统计学员课时消耗情况',
        }}
        operators={[
          {
            label: '学员消耗课时计算教程',
            callback: () => redirect('https://help.youzan.com/displaylist/detail_13_13-2-53516'),
          },
        ]}
        colorSchema={{ secondaryColor: '#969799' }}
        headerSplitRatio={0.75}
        border={false}
      />
      <div className="signin-list__body">
        <List
          mode="none"
          defaultFilter={{ pageSize: 20 }}
          onError={err => Notify.error(err.message)}
          delay={/** 延迟200ms加载，防止在filter未初始化完成时进行请求 */ 200}
          onSubmit={signinEditModel.fetchList}
        >
          <Filter
            config={signinEditModel.filterConfig}
            collapseConfig={signinEditModel.collapseConfig}
            actionsOption={{ beforeReset: renderExportBtn }}
          />
          <EasyGrid
            rowKey="operateId"
            customColumns
            customColumnsDialogTitle="配置签到记录表头"
            scroll={{ x: 1900 }}
            pageSizeOptions={[10, 20, 50, 100]}
            columns={signinEditModel.gridConfig}
          />
        </List>
      </div>
    </div>
  );
};
