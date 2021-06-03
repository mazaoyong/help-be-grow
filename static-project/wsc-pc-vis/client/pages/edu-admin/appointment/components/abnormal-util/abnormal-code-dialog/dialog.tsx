import React from 'react';
import { Dialog, Notify, Button } from 'zent';
import { IAbnormalCodeDialogProps } from './types';
import abnormalCodeConfig, { SIGNINTYPES } from './abnormal-code-config';
import openLockedDialog from '../lock-course-dialog';

const { openDialog, closeDialog } = Dialog;

const openAbnormalCodeDialog: (props: IAbnormalCodeDialogProps) => void = (props) => {
  const { data, type = 0, onConfirm = () => {}, kdtId } = props;
  const { checkCode = 0, message = '' } = data || {};
  const abnormalConfig = abnormalCodeConfig.find(item => item.code === checkCode) || abnormalCodeConfig[0];
  const signinText = (function() {
    if (type >= 0) {
      return SIGNINTYPES[type];
    } else if (type === -1) {
      return '预约';
    } else if (type === -2) {
      return '修改';
    }
  })();
  switch (checkCode) {
    case 0:
      // 如果是修改预约，轮询获取结果
      if (type === -2) {
        onConfirm();
      } else {
        Notify.success(`${signinText}成功`);
        onConfirm();
      }
      break;
    case 21:
    case 30:
    case 31:
    case 100:
      const descption = checkCode === 100 ? '学员在该日程已被移除' : checkCode === 21 ? '' : `${signinText}失败，学员的课时已被变更`;
      openDialog({
        dialogId: 'abnormal-code-notice-dialog',
        title: abnormalConfig.desc,
        maskClosable: false,
        children: <div>
          <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>{descption}</p>
          {abnormalConfig.tips(data, type)}
        </div>,
        footer: <>
          {checkCode === 31 && <Button disabled={!data} onClick={() => {
            const { numCheckDetail = {}, assetNo = '' } = data || {};
            const { availableNum, consumeNum, lockedNum, needRemoved } = numCheckDetail;
            closeDialog('abnormal-code-notice-dialog');
            openLockedDialog({
              available: availableNum,
              consumeNum: consumeNum,
              locked: lockedNum,
              kdtId,
              assetNos: [assetNo],
              studentLessonNo: data.studentLessonNo || '',
              needRemoved,
              isEdit: type === -2,
            });
          }}>前往取消日程</Button>}
          <Button type='primary' onClick={() => {
            closeDialog('abnormal-code-notice-dialog');
          }}>我知道了</Button>
        </>,
        onClose: () => {
          closeDialog('abnormal-code-notice-dialog');
          if (type >= 0) {
            onConfirm();
          }
        },
      });
      break;
    default:
      Notify.error(abnormalConfig.tips(data, type) || message);
      break;
  }
};

export default openAbnormalCodeDialog;
