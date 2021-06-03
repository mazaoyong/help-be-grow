import React from 'react';

import { IDialogChildrenProps, IopenDialogOptions } from '@youzan/ebiz-components/es/types/dialog';
import { Dialog } from '@youzan/ebiz-components';
import { Button } from 'zent';
import styles from './styles.m.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

interface IAgreementDialogProps {
  /** 取消按钮的文案，默认为「取消」 */
  cancelText?:string;
  /** 确认按钮的文案，默认为「同意」 */
  confirmText?:string;
  /** 协议内容 */
  content:string;
}

const DialogContent: React.FC<IDialogChildrenProps<void, IAgreementDialogProps>> = (props) => {
  const { dialogref, loadingState, data } = props;
  const { cancelText = '取消', confirmText = '同意', content = '' } = data;
  return (
    <>
      <DialogBody>
        <div className={styles.agreementDialogContent} dangerouslySetInnerHTML={{ __html: content }} />
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>{cancelText}</Button>
        <Button type="primary" loading={loadingState} onClick={() => { dialogref.submit(); }}>
          {confirmText}
        </Button>
      </DialogFooter>
    </>
  );
};

export interface IOpenAgreementDialogParams extends IAgreementDialogProps {
  /** 对话框的标题 */
  title:string;
  /** 点击确认按钮的回调 */
  submitEffect?: () => Promise<boolean>;
}

export default function openAgreementDialog(params: IOpenAgreementDialogParams) {
  const { title, submitEffect, ...dialogProps } = params;
  const payload : IopenDialogOptions<IAgreementDialogProps> = {
    data: dialogProps,
    title,
    mask: true,
    className: styles.agreementDialog
  };

  if (submitEffect) {
    payload.submitEffect = submitEffect;
  }
  return openDialog(DialogContent, payload);
}
