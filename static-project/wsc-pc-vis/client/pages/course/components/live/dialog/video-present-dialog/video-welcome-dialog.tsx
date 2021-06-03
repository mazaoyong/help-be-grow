import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import * as Api from './api';

interface IOptions {
  present: number;
  onSuccess?: Function;
}

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'VIDEO_PRESENT_DIALOG';

export const openVideoPlaybackDialog = (options: IOptions) => {
  const { present, onSuccess } = options;

  const handleClick = () => {
    Api.refreshSurvey({ value: present })
      .then(() => {
        closeDialog(DIALOG_ID);
        onSuccess && onSuccess();
      })
      .catch(error => Notify.error(error));
  };

  openDialog({
    style: { width: '488px' },
    dialogId: DIALOG_ID,
    title: '欢迎使用',
    maskClosable: false,
    children: `欢迎使用有赞教育视频直播功能，赠送您${present}观看分钟数，快来构建精彩的直播课堂吧。`,
    footer: (
      <>
        <Button onClick={() => closeDialog(DIALOG_ID)}>取消</Button>
        <Button type="primary" onClick={handleClick}>
          确定
        </Button>
      </>
    ),
  });
};
