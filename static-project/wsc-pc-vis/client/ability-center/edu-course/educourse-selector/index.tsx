import React, { useCallback } from 'react';
import { Dialog } from 'zent';
import { IEduCourseDialogProps } from './types';
import EduCourseList from './list';

const { openDialog, closeDialog } = Dialog;

const useEducourseSelect: (options: IEduCourseDialogProps) => Function = ({ onConfirm = () => {}, kdtId }) => {
  const openListDialog = useCallback(() => {
    openDialog({
      dialogId: 'educourse-dialog',
      title: '选择转入课程',
      children: <EduCourseList onConfirm={(data) => { closeDialog('educourse-dialog'); onConfirm(data); }} kdtId={kdtId} onClose={() => closeDialog('educourse-dialog')}/>,
    });
  }, [ onConfirm ]);

  return openListDialog;
};

export default useEducourseSelect;
