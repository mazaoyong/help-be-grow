import React, { useCallback, useState } from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import { Button, Notify, Dialog } from 'zent';
import { hashHistory } from 'react-router';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';

import { findTaskProgressRequest, prepareImportRequest, submitImportRequest } from './requests';
import { dialogIdMap, IMPORT_TYPE } from '../../constants';
import PollingDialog from '../polling-dialog';
import { checkTemplateProcessByTaskId } from '../check-template-process';

const { openDialog, closeDialog } = Dialog;

const { openDialog: openEbizDialog } = EbizDialog;

export default function useActions({
  taskId,
  taskTotal,
  branchKdtId,
  toggleErrOnly,
  importType,
  onRefresh,
}) {
  const [submitLoading, toggleSubmitLoading] = useState(false);
  const [cancelLoading, toggleCancelLoading] = useState(false);
  const handleImport = useCallback(
    (needCover?: boolean) => {
      if (!taskId) {
        Notify.error('未选择导入任务');
        return;
      }

      submitImportRequest({ taskId, cover: needCover ? 1 : 0 })
        .then(res => {
          if (res) {
            const dialogId = dialogIdMap.importPolling;
            openEbizDialog(PollingDialog, {
              dialogId,
              className: 'polling-dialog-wrapper',
              style: { minWidth: '280px' },
              mask: true,
              closeBtn: false,
              maskClosable: false,
              data: {
                pollingRequest: findTaskProgressRequest,
                requestParams: {
                  query: [
                    {
                      taskId,
                      importStage: 1, // 导入中
                    },
                  ],
                },
                quant: taskTotal,
                nextPage: `add/${taskId}/step=3${branchKdtId ? `?kdtId=${branchKdtId}` : ''}`,
                type: '导入',
              },
            });
          }
        })
        .catch(e => {
          Notify.error(e || '导入失败，请稍后重试');
          toggleSubmitLoading(false);
        });
    },
    [taskId, taskTotal, branchKdtId],
  );

  const handleConfirmImport = useCallback(
    async e => {
      e.preventDefault();
      if (!taskId) {
        Notify.error('未选择导入任务');
        return;
      }

      toggleSubmitLoading(true);

      try {
        if (importType === IMPORT_TYPE.byStudentInfo) {
          const pass = await checkTemplateProcessByTaskId({ taskId, onProcessComplete: onRefresh });
          if (!pass) return;
        }
        const res = await prepareImportRequest({ taskId });
        const { canSubmit = false, warnRows = 0, commonRows } = res;
        const hasConflict = !!commonRows;
        if (!canSubmit) {
          Notify.error(`还有${warnRows}条数据有误，请修改`);
          toggleSubmitLoading(false);
          return;
        }

        const dialogId = dialogIdMap.importConfirm;
        if (hasConflict) {
          openDialog({
            dialogId,
            title: '提示',
            className: 'import-verification-dialog',
            children: (
              <div>
                <span>
                  有{commonRows}
                  条数据与系统内现有学员数据冲突，请根据提示核对。若无需修改，可继续导入任务。
                </span>
              </div>
            ),
            footer: (
              <>
                <Button
                  onClick={() => {
                    toggleErrOnly(true);
                    toggleSubmitLoading(false);
                    closeDialog(dialogId);
                  }}
                >
                  返回查看
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    closeDialog(dialogId);
                    toggleSubmitLoading(false);
                    handleImport(true);
                  }}
                >
                  覆盖已有数据
                </Button>
              </>
            ),
            maskClosable: false,
          });
          return;
        }

        if (warnRows === 0) {
          handleImport();
          return;
        }
        openDialog({
          dialogId,
          title: '提示',
          className: 'import-verification-dialog',
          children: (
            <div>
              <span>有{warnRows}条数据可能有误，请根据提示核对，若无需修改，可继续导入任务。</span>
            </div>
          ),
          footer: (
            <>
              <Button
                onClick={() => {
                  toggleErrOnly(true);
                  toggleSubmitLoading(false);
                  closeDialog(dialogId);
                }}
              >
                返回查看
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  closeDialog(dialogId);
                  toggleSubmitLoading(false);
                  handleImport();
                }}
              >
                导入
              </Button>
            </>
          ),
          maskClosable: false,
        });
      } catch (error) {
        Notify.error(error || '获取导入校验结果失败，请稍后重试');
      } finally {
        toggleSubmitLoading(false);
      }
    },
    [taskId, importType, toggleErrOnly, handleImport],
  );

  const handleCancelImport = useCallback(() => {
    if (!taskId) {
      hashHistory.push('list');
    }
    toggleCancelLoading(true);
    const dialogId = dialogIdMap.importCancel;
    openDialog({
      dialogId,
      title: '提示',
      className: 'cancel-import-dialog',
      children: (
        <div>
          <span>我们将为你保存当前所做操作，你可以稍后回来继续修改，并完成导入。</span>
        </div>
      ),
      footer: (
        <>
          <Button
            onClick={() => {
              closeDialog(dialogId);
            }}
          >
            我再想想
          </Button>
          <Button
            type="primary"
            onClick={() => {
              closeDialog(dialogId);
              hashHistory.push('list');
            }}
          >
            确定
          </Button>
        </>
      ),
      onClose: () => {
        toggleCancelLoading(false);
      },
      maskClosable: false,
    });
  }, [taskId]);

  const appActions = (
    <div className="app-actions">
      <div className="form-actions new-actions text-center">
        <SamButton
          name="编辑"
          type="primary"
          loading={submitLoading}
          disabled={taskTotal === 0}
          onClick={handleConfirmImport}
        >
          导入
        </SamButton>

        <SamButton name="编辑" loading={cancelLoading} onClick={handleCancelImport}>
          暂不导入
        </SamButton>
      </div>
    </div>
  );
  return { appActions };
}
