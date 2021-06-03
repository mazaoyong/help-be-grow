import React from 'react';
import { Dialog, Button } from 'zent';
import { isBranchStore } from '@youzan/utils-shop';

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'VIDEO_RECHARGE_DIALOG';

const rechargeUrl = `${_global.url.v4}/subscribe/appmarket/appdesc?id=50190`;
const rechargeTips = `您的视频直播剩余观看时长不足，将导致学员无法正常观看直播，${
  isBranchStore ? '请联系总部充值后继续使用' : '请充值后继续使用'
}。`;

export const openVideoRechargeDialog = () => {
  return openDialog({
    style: { width: '488px' },
    dialogId: DIALOG_ID,
    title: '剩余观看时长不足',
    maskClosable: false,
    children: rechargeTips,
    footer: isBranchStore ? (
      <Button type="primary" onClick={() => closeDialog(DIALOG_ID)}>
        我知道了
      </Button>
    ) : (
      <>
        <Button onClick={() => closeDialog(DIALOG_ID)}>取消</Button>
        <Button type="primary" href={rechargeUrl} target="_blank">
          立即充值
        </Button>
      </>
    ),
  });
};
