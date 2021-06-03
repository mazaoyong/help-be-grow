import React from 'react';
import { Dialog } from 'zent';
import CourseList from './list';
import { ICourseListProps } from './types';

const { openDialog, closeDialog } = Dialog;

const openCourseDialogList: (props: ICourseListProps) => void = (props) => {
  openDialog({
    dialogId: 'course-dialog-list',
    title: '上课列表',
    children: <CourseList {...props} />,
    onClose: () => {
      closeDialog('course-dialog-list');
    },
  });
};

export default openCourseDialogList;
