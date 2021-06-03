import React from 'react';
import { Dialog } from 'zent';
import ConflictDialogContent from './ConfilctDialogContent';

const { openDialog, closeDialog } = Dialog;
const dialogId = 'conflict-dialog';

const open = (options = {}) => {
  const { defaultData = {} } = options;

  return new Promise((resolve, reject) => {
    openDialog({
      dialogId,
      title: '日程冲突',
      children: (
        <ConflictDialogContent defaultData={defaultData} callback={resolve} closeDialog={close} />
      ),
      onClose() {},
    });
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
