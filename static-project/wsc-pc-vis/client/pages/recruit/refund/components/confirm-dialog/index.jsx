import React, { useCallback, useState } from 'react';
import { Dialog, Button } from 'zent';

import openUnlockDialog from '@ability-center/common/unlock-lesson-dialog';

import './styles.scss';

import { cent2yuan, parseParams } from '../../util';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'confirm';

const urlParams = parseParams();

function closeConfirmDialog() {
  closeDialog(dialogId);
}

const UnlockLessonTip = ({ refundCourseValue, remaining }) => {
  return (
    <div className="edu-refund-unlock-dialog-tips">
      本次要退回的
      <span>{cent2yuan(refundCourseValue)}</span>
      课时中，有
      <span>{cent2yuan(refundCourseValue - remaining)}</span>
      课时已被冻结。请先将学员从日程中移除再操作退课。
    </div>
  );
};

function ConfirmDialog({ data, confirmAfter }) {
  const [loading, setLoading] = useState(false);
  // if there is more than one, to do
  const {
    simpleOrderCreateCommand: {
      studentName,
      courseName,
    },
    courseTime,
    refundCourseValue,
    refundFee,
    removeStudent,
    courseSellType,
    courseType,
    assetNo,
  } = data.refundCommand.refundItemList[0];

  const handleConfirm = useCallback(() => {
    // 取本地缓存的 unlocked，这条资产刚刚被解锁的课时
    const unlocked = (window.unlocked && window.unlocked[assetNo]) || 0;
    if (courseTime && (courseTime.remaining + unlocked < refundCourseValue) &&
      (refundCourseValue !== courseTime.locked + courseTime.remaining)) {
      openUnlockDialog({
        title: '退课提示',
        list: [
          {
            assetNo,
            tip: <UnlockLessonTip refundCourseValue={refundCourseValue} remaining={courseTime.remaining} />
          }
        ],
        kdtId: urlParams.kdtId,
        successCbk: (selectedRowData) => {
          // 本地缓存 unlocked，这条资产刚被解锁的课时
          if (!window.unlocked) {
            window.unlocked = {};
          }
          selectedRowData.forEach(item => {
            window.unlocked[assetNo] = item.lockedNum + (window.unlocked[assetNo] || 0);
          });
        }
      });
    } else {
      confirmAfter(data, setLoading);
    }
  }, [assetNo, courseTime, refundCourseValue, confirmAfter, data]);

  // check unlock
  let refundName = '';
  let refundContent1 = '';
  let refundContent2 = '';
  let refundTail = '确定退课？';

  if (refundCourseValue) {
    switch (courseType && courseSellType) {
      case 1:
        refundContent1 = cent2yuan(refundCourseValue) + '课时';
        break;
      case 0:
      case 2:
        refundContent1 = refundCourseValue + '天';
        break;
      case 3:
        refundName = courseName;
        break;
      default:
    }
  }

  if (refundFee) {
    refundContent2 = '¥' + cent2yuan(refundFee, 2);
  }

  const refundContent = [refundContent1, refundContent2].filter(Boolean).join('/');

  if (removeStudent) {
    if (courseType === 0) {
      refundTail = '退课后，系统将自动取消未上课的预约。';
    } else if (courseSellType === 3) {
      refundTail = '退课后，学员将被移除出班级，无法查看班级的课表。';
    } else {
      refundTail = '退课后，学员无法继续查看课程安排、预约课程等。';
    }
  }

  return (
    <>
      <div>退课学员：{studentName}</div>
      {refundName ? <div>退课名称：{refundName}</div> : null}
      {refundContent ? <div>退课内容：{refundContent}</div> : null}
      {refundTail}
      <div className="edu-refund-confirm-dialog-footer">
        <Button onClick={closeConfirmDialog}>取消</Button>
        <Button type="primary" onClick={handleConfirm} loading={loading}>确定</Button>
      </div>
    </>
  );
}

function openConfirmDialog(confirmAfter, data) {
  openDialog({
    dialogId,
    title: '确定退课',
    children: <ConfirmDialog data={data} confirmAfter={confirmAfter} />,
  });
}

export { openConfirmDialog, closeConfirmDialog };
