import React, { useCallback } from 'react';
import { Dialog } from 'zent';
import { IStudentDialogProps } from './types';
import StudentList from './list';

const { openDialog, closeDialog } = Dialog;

const useStdudentSelect: (options: IStudentDialogProps) => Function = ({ onConfirm = () => {} }) => {
  const openListDialog = useCallback(() => {
    openDialog({
      dialogId: 'educourse-dialog',
      title: '选择学员',
      children: <StudentList onConfirm={(data) => { closeDialog('educourse-dialog'); onConfirm(data); }} onClose={() => closeDialog('educourse-dialog')}/>,
    });
  }, [ onConfirm ]);

  return openListDialog;
};

export default useStdudentSelect;
