import { Dialog } from '@youzan/ebiz-components';
import { Notify } from 'zent';
import { IDialogSubmitEffect } from '@youzan/ebiz-components/es/types/dialog';
import accMul from '@youzan/utils/number/accMul';
import { updateCourseTime } from '../../../../../api/student-detail';
import { IEditCourseTimeReturns } from './types';
import DialogContent from './Content';
const { openDialog } = Dialog;

const openCourseDialog = (props) => {
  const defaultData = props.defaultData;

  const submitEffect: IDialogSubmitEffect<IEditCourseTimeReturns> = (data) => {
    console.log('submitEffect', data);

    return updateCourseTime({
      assetNo: data.assetNo,
      studentId: data.studentId,
      updateCourse: accMul(data.number, 100),
      updateType: data.type,
      kdtId: data.kdtId,
      changeType: data.reduceType,
      remark: data.mark,
    })
      .then(() => {
        Notify.success('保存成功');
        return true;
      })
      .catch((err) => {
        Notify.error(err);
        return true;
      });
  };

  openDialog(DialogContent, {
    data: {
      kdtId: defaultData.kdtId,
      studentId: defaultData.studentId,
      assetNo: defaultData.assetNo,
    },
    title: '修改课时',
    mask: true,
    submitEffect: submitEffect,
    className: 'dialog-edit-course-time'
  })
    .afterClosed()
    .then((data) => {
      console.log('submit', data);
      props.callback();
    })
    .catch(() => {
      console.log('close');
    });
};

export default openCourseDialog;
