import React from 'react';
import { Dialog } from 'zent';
import EduClassDialogContent from './EduClassDialogContent';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'edu-class-dialog';

const open = (options = {}) => {
  const { defaultData = {}, callback = () => {} } = options;
  openDialog({
    dialogId: dialogId,
    title: defaultData.eduClass ? '编辑班级' : '新建班级',
    children: (
      <EduClassDialogContent defaultData={defaultData} callback={callback} closeDialog={close} />
    ),
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
