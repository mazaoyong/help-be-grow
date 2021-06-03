import React from 'react';
import { Dialog } from 'zent';
import AppointmentDialogContent from './AppointmentDialogContent';
import { APPOINTMENT_STATUS_TYPE } from '../../constants';
import { APPOINTMENT_TYPE } from './constants';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'appointment-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {}, type } = options;
  /**
   * type
   * [create-try, create-appointment, edit-appointment, confirm-try]
   */
  const title = (function getTitle() {
    const map = {
      [APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED]: '确认预约',
      [APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED]: '修改预约',
    };
    let title = map[defaultData.studentLessonStatus] || '新建预约';
    if ([APPOINTMENT_TYPE.CREATE_TRY].includes(type)) {
      title = '办理试听';
    }

    return title;
  })();
  openDialog({
    dialogId: dialogId,
    title,
    className: 'appointment-dialog',
    children: (
      <AppointmentDialogContent defaultData={defaultData} callback={callback} closeDialog={close} type={type} />
    ),
    /* style: {
      width: '514px',
    }, */
    maskClosable: false,
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
