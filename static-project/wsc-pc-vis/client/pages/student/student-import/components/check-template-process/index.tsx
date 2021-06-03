import InfoTip from '@ability-center/student/info-tip';
import React from 'react';
import { Button, Dialog } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';

import { againValidate, templateCheck, templateCheckByTaskId } from '../../api/prepare';
import styles from './styles.m.scss';
import { dialogIdMap } from '../../constants';
import PollingDialog from '../polling-dialog';
import { findTaskProgressRequest } from '../upload-confirm/requests';

const dialogTipId = 'checkTemplateProcessTip';
const { openDialog: openEbizDialog } = EbizDialog;

interface ICheckTemplateProcessParams {
  fileUrl: string;
  branchKdtId?: number;
  taskId?: number;
}

interface IByTaskIdParams {
  taskId: number;
  onProcessComplete?: () => void;
}

export default async function checkTemplateProcess(params: ICheckTemplateProcessParams) {
  const { fileUrl, branchKdtId } = params;
  const checkRes = await templateCheck({
    templateType: 0,
    importFile: { fileUrl, privateUrl: true },
    taskId: 0,
    kdtId: branchKdtId,
  });
  if (!checkRes) {
    throw new Error('模板校验失败，请下载最新的模板');
  }
}

export function checkTemplateProcessByTaskId(params: IByTaskIdParams) {
  const { taskId, onProcessComplete } = params;

  return new Promise<boolean>(async (resolve, reject) => {
    let deleteStr, insertStr;
    try {
      const { pass, delItems, newItems } = await templateCheckByTaskId({ taskId });
      if (delItems && delItems.length) {
        deleteStr = delItems.map(item => `#${item}#`).join(' ') + '被删除';
      }
      if (newItems && newItems.length) {
        insertStr = '新增' + newItems.map(item => `#${item}#`).join(' ');
      }

      if (pass) {
        resolve(true);
        return;
      }
    } catch (error) {
      reject(error);
      return;
    }

    const itemStr = [deleteStr, insertStr].filter(d => !!d).join('，') + '。';

    async function handleRefresh() {
      Dialog.closeDialog(dialogTipId);
      try {
        const validateRes = await againValidate({ taskId });
        if (!validateRes) {
          reject('校验失败');
          return;
        }
        resolve(false);
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
                  importStage: 30, // 校验中
                },
              ],
            },
            onReturn: () => {},
            type: '校验',
          },
        })
          .afterClosed()
          .catch(() => {
            onProcessComplete && onProcessComplete();
          });
      } catch (error) {
        reject(error);
      }
    }

    Dialog.openDialog({
      dialogId: dialogTipId,
      title: '提示',
      children: (
        <InfoTip>
          {({ openAddPage }) => {
            return (
              <div className={styles.desc}>
                <span>以下学员资料项已被修改，请刷新后查看。</span>
                <span>{itemStr}</span>
                <br />
                <span>
                  你也可以修改学员资料项后重试。
                  <SamLink className={styles.pointer} onClick={openAddPage}>去修改</SamLink>
                </span>
              </div>
            );
          }}
        </InfoTip>
      ),
      footer: (
        <Button type="primary" onClick={handleRefresh}>
          刷新
        </Button>
      ),
      onClose: () => {
        Dialog.closeDialog(dialogTipId);
        resolve(false);
      },
    });
  });
}
