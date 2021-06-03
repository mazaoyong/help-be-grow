import React from 'react';
import { IEditDirDialogProps } from './types';
import { Dialog } from 'zent';
import EditDirForm from './form';
const { openDialog, closeDialog } = Dialog;

const openEditDirDialog: (props: IEditDirDialogProps) => void = (props) => {
  const { type, level = 'parentNode', onCancel } = props;
  const isSubNode = level === 'subNode';

  const close = () => {
    closeDialog('edit-dir__dialog');
    onCancel && onCancel();
  };

  openDialog({
    dialogId: 'edit-dir__dialog',
    title: type === 'update' ? `${isSubNode ? '子' : ''}目录重命名` : `新增${isSubNode ? '子' : ''}目录`,
    children: <EditDirForm {...props} onCancel={() => close()}/>,
    onClose: () => close(),
  });
};

export default openEditDirDialog;
