import { Dialog } from '@youzan/ebiz-components';
import { Notify } from 'zent';
import { IDialogSubmitEffect } from '@youzan/ebiz-components/es/types/dialog';
import { modifyAvailableTime } from '../../../../../api/student-detail';
import { IEditAvailableTimeReturns } from './types';
import DialogContent from './Content';
const { openDialog } = Dialog;

const openCourseDialog = (props) => {
  const defaultData = props.defaultData;

  const submitEffect: IDialogSubmitEffect<IEditAvailableTimeReturns> = (data) => {
    console.log('submitEffect', data);

    const command = {
      assetNo: data.assetNo,
      studentId: data.studentId,
      kdtId: data.kdtId,
      startTime: data.startTime,
      endTime: data.endTime,
      remark: data.mark
    };
    return modifyAvailableTime({ command })
      .then(() => {
        Notify.success('修改有效期成功');
        return true;
      })
      .catch(err => {
        Notify.error(err);
        return true;
      });
  };

  openDialog(DialogContent, {
    data: {
      kdtId: defaultData.kdtId,
      assetNo: defaultData.assetNo,
      studentId: defaultData.studentId,
      startTime: defaultData.time[0],
      endTime: defaultData.time[1],
      mark: defaultData.mark,
    },
    title: '修改有效期',
    mask: true,
    submitEffect: submitEffect,
    className: 'available-change'
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
