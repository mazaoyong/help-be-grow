import React from 'react';
import { Dialog } from 'zent';
import { ICourseDialogProps } from './types';
import CourseList from './list';

const { openDialog, closeDialog } = Dialog;

const openCourseDialog: (props: ICourseDialogProps) => void = (props) => {
  const { available = 0, consumeNum = 0, locked = 0, onConfirm = () => {}, isEdit, needRemoved, ...restProps } = props;
  let diffEl = (
    <p className='lock_course_dialog_desc'>有 <span className='lock_course_dialog_num'>{locked / 100}</span> 课时已被冻结，可先将学员从日程中移出再操作。</p>
  );
  if (isEdit && needRemoved) {
    diffEl = (
      <p className='lock_course_dialog_desc'>需移除 <span className='lock_course_dialog_num'>{needRemoved / 100}</span> 课时后，才能修改预约。</p>
    );
  }
  openDialog({
    dialogId: 'lock-course-dialog',
    title: '冻结课时明细',
    maskClosable: false,
    children: <div>
      <div className='lock_course_dialog_wrapper'>
        <p>本节课{consumeNum ? <>需扣减 <span className='lock_course_dialog_num'>{consumeNum / 100}</span> 课时，</> : ''}剩余 <span className='lock_course_dialog_num'>{available / 100}</span> 课时可用。</p>
        { diffEl }
        <CourseList {...restProps} onConfirm={() => {
          closeDialog('lock-course-dialog');
        }} />
      </div>
    </div>,
    onClose: () => {
      closeDialog('lock-course-dialog');
      onConfirm();
    },
  });
};

export default openCourseDialog;
