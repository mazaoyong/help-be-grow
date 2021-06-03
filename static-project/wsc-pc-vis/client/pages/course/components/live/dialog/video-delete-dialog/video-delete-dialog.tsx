import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import * as Api from './api';

interface IOptions {
  alias: string;
  onSuccess?: Function;
}

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'VIDEO_DELETE_DIALOG';

export const openVideoDeleteDialog = (options: IOptions) => {
  const { alias, onSuccess } = options;

  const handleClick = () => {
    Api.deleteLive({ alias })
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
    title: '删除直播',
    maskClosable: false,
    children:
      '直播删除后，已购买的用户将无法观看直播，是否确认删除？',
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
