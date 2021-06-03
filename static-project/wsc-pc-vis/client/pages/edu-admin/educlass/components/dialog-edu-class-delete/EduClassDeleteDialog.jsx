import React from 'react';
import { Dialog } from 'zent';
import EduClassDeleteDialogContent from './EduClassDeleteDialogContent';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'edu-class-delete-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {} } = options;
  openDialog({
    dialogId: dialogId,
    title: '删除班级',
    children: (
      <EduClassDeleteDialogContent
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
