import React from 'react';
import { Dialog } from 'zent';
import MaxStudentDialogContent from './MaxStudentDialogContent';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'max-student-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {} } = options;
  openDialog({
    dialogId: dialogId,
    title: '日程名额满员',
    children: (
      <MaxStudentDialogContent defaultData={defaultData} callback={callback} closeDialog={close} />
    ),
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
