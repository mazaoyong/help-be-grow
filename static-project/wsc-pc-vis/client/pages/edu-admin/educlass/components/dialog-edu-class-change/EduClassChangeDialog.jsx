import React from 'react';
import { Dialog } from 'zent';
import EduClassChangeDialogContent from './EduClassChangeDialogContent';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'edu-class-change-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {}, className } = options;
  openDialog({
    dialogId: dialogId,
    title: '调班',
    className,
    children: (
      <EduClassChangeDialogContent
        defaultData={defaultData}
        callback={callback}
        closeDialog={close}
      />
    ),
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
