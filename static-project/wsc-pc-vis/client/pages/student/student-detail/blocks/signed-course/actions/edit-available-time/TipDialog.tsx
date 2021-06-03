import React, { useCallback, useMemo } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Button } from 'zent';
import format from 'date-fns/format';

const { openDialog, DialogBody, DialogFooter } = Dialog;

const TipContent = ({ dialogref, data }) => {
  const { endTime, assetInfo } = data;
  const onClose = useCallback(() => {
    dialogref.close();
    console.log(data);
  }, []);
  const onOk = useCallback(() => {
    dialogref.close();
    dialogref.submit();
  }, []);
  const decreaseDay = useMemo(() => {
    return Math.floor((assetInfo.validityEndTime - new Date(endTime).getTime()) / (1000 * 60 * 60 * 24));
  }, [assetInfo, endTime]);
  const containReward = useMemo(() => {
    return assetInfo.rewardRemaining > 0 ? decreaseDay > assetInfo.rewardRemaining
      ? assetInfo.rewardRemaining : decreaseDay : 0;
  }, [decreaseDay, assetInfo]);
  return (
    <>
      <DialogBody>
        <div className='tip-dialog-content'>
          <p className='tip-item'>你正在修改学员课程有效期，修改后：</p>
          <p className='tip-item'>- 课程有效期将扣减{decreaseDay}天（含赠送{containReward}天）</p>
          <p className='tip-item'>- 如果学员有日程晚于修改后的截止日期，系统会自动取消未签到日程</p>
          <p className='tip-item'>- 当前操作只扣减天数，不退费用，不会影响单天价格；如需退费，请取消当前操作，并使用退课功能</p>
          <p className='tip-item bottom'>你确定将课程有效期的截止日期由{format(assetInfo.validityEndTime, 'YYYY-MM-DD')}修改至{format(endTime, 'YYYY-MM-DD')}吗？</p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose}>取消</Button>
        <Button type="primary" onClick={onOk}>
          确定
        </Button>
      </DialogFooter>
    </>
  );
};

const TipDialog = ({ assetInfo, callback, onOk, endTime }) => {
  openDialog(TipContent, {
    data: {
      assetInfo,
      endTime
    },
    title: '提示',
    mask: true,
    className: 'set-available-time-tip-dialog',
    submitEffect: onOk
  })
    .afterClosed()
    .then(() => {
      callback();
    });
};

export default TipDialog;
