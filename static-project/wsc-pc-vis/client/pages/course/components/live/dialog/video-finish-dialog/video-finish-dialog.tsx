import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import * as Api from './api';

interface IOptions {
  alias: string;
  onSuccess?: Function;
}

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'VIDEO_FINISH_DIALOG';

export const openVideoFinishDialog = (options: IOptions) => {
  const { alias, onSuccess } = options;

  const handleClick = () => {
    Api.postUpdateCloseLive({ alias })
      .then(() => {
        closeDialog(DIALOG_ID);
        onSuccess && onSuccess();
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  return openDialog({
    style: { width: '488px' },
    dialogId: DIALOG_ID,
    title: '结束直播',
    maskClosable: false,
    children:
      '直播结束后讲师将无法进入直播间继续进行直播，可开启回放供用户观看直播回放，确定要结束直播吗？',
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
