import React, { Component } from 'react';
import { Link } from 'react-router';
import { Notify, closeDialog } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';
import ImportList from 'components/import-list';

import PollingDialog from '../../components/polling-dialog';
import { dialogIdMap } from '../../constants';
import { findImportTaskByPage, listRowFieldErrorSummary } from '../../api/list';
import { findTaskProgress } from '../../api/import';
import { prepareReimport } from '../../api/result';

import './styles.scss';

const { openDialog: openEbizDialog } = EbizDialog;

class ImportRecordList extends Component {
  state = {
    reimportDialogOpen: false,
  }

  componentWillUnmount() {
    closeDialog(dialogIdMap.reimport);
    closeDialog(dialogIdMap.confirmDialog);
  }

  handleReimport = (taskId, importType, failedRowNum, targetKdtId) => {
    if (this.state.reimportDialogOpen) return;

    this.setState({ reimportDialogOpen: true });
    prepareReimport({ taskId })
      .then(() => {
        const dialogId = dialogIdMap.reimport;
        openEbizDialog(PollingDialog, {
          dialogId,
          className: 'polling-dialog-wrapper',
          style: { minWidth: '280px' },
          mask: true,
          closeBtn: false,
          maskClosable: false,
          data: {
            pollingRequest: findTaskProgress,
            requestParams: {
              query: [{
                taskId,
                importStage: 30, // 校验中
              }],
            },
            quant: failedRowNum,
            nextPage: `add${taskId ? `/${taskId}` : ''}/step=2?error=1&type=${importType}${targetKdtId ? `&kdtId=${targetKdtId}` : ''}`,
            onReturn: () => {
              this.fetchRecordList();
            },
            type: '校验',
          }
        }).afterClosed().catch();
      })
      .catch(e => {
        Notify.error(e || '网络错误，请稍后重试');
      })
      .finally(() => {
        this.setState({ reimportDialogOpen: false });
      });
  };

  render() {
    return (
      <div className="import__container">
        <Link to="/add/step=1">
          <SamButton name='编辑' type="primary">批量导入学员</SamButton>
        </Link>
        <ImportList
          className="import__container__list"
          needValidation={true}
          enablePolling={true}
          validationRequest={listRowFieldErrorSummary}
          findTaskProgress={findTaskProgress}
          handleReimport={this.handleReimport}
          findImportTaskByPageRequest={findImportTaskByPage}
          recordPageUrl='//www.youzan.com/v4/vis/edu/page/stuimport#/record'
          hasImportType={true}
        />
      </div>
    );
  }
};

export default ImportRecordList;
