import React from 'react';
import { Dialog } from 'zent';
import MoveDirectoryContent from './dialog-content';
import './style.scss';
import { IMoveDirProps } from './types';

const { openDialog, closeDialog } = Dialog;

const openDirectoryMoveDialog: (props: IMoveDirProps) => void = (props) => {
  const { onCancel } = props;
  const close = () => {
    closeDialog('directory-move-dialog');
    onCancel && onCancel();
  };

  openDialog({
    dialogId: 'directory-move-dialog',
    title: '选择目录',
    onClose: () => close(),
    children: <MoveDirectoryContent {...props} onClose={() => close()}/>
  });
};

export default openDirectoryMoveDialog;
