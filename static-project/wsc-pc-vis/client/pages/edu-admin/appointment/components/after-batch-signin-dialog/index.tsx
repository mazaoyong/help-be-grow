import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import BatchSigninList from './batch-signin-list';
import { IAfterBatchSigninProps } from './types';
import './index.scss';
const { openDialog, closeDialog } = Dialog;

const SIGNINTYPES: string[] = ['签到', '标记请假', '标记未到'];

const openBatchSigninDialog: (props: IAfterBatchSigninProps) => void = (props) => {
  const { data, type, onConfirm = () => {}, mode = 'schedule' } = props;
  const { failedNum = 0, successNum = 0, studentErrorDTOS } = data || {};
  if (failedNum) {
    openDialog({
      dialogId: 'batch-signin-notice-dialog',
      title: '提示',
      maskClosable: false,
      footer: <>
        <Button type='primary' onClick={() => {
          closeDialog('batch-signin-notice-dialog');
          onConfirm();
        }}>我知道了</Button>
      </>,
      children: <div>
        <p className="batch_signin_result">{successNum}名学员已{type >= 0 ? SIGNINTYPES[type] : '添加'}成功，{failedNum}名学员失败</p>
        <BatchSigninList mode={mode} data={studentErrorDTOS}/>
      </div>,
      onClose: () => {
        closeDialog('batch-signin-notice-dialog');
        onConfirm();
      },
    });
  } else {
    Notify.success(`${successNum}名学员${type >= 0 ? SIGNINTYPES[type] : '添加'}成功`);
    onConfirm();
  }
};

export default openBatchSigninDialog;
