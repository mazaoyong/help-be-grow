import React from 'react';
import { Dialog } from 'zent';
import AppointmentCancelDialogContent from './AppointmentCancelDialogContent';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'appointment-cancel-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {} } = options;
  openDialog({
    dialogId: dialogId,
    title: '取消预约',
    children: (
      <AppointmentCancelDialogContent
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
