import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import { PlaybackStatus } from './types';
import * as Api from './api';

interface IOptions {
  alias: string;
  status: PlaybackStatus;
  onSuccess?: Function;
}

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'VIDEO_PLAYBACK_DIALOG';

const playbackConfig = {
  [PlaybackStatus.open]: {
    title: '开启回放',
    content:
      '开启回放后，订阅直播的用户可以观看直播回放。回放内容的准备需要一些时间，准备完成后用户即可观看回放。',
  },
  [PlaybackStatus.close]: {
    title: '关闭回放',
    content: '关闭回放后，订阅直播的用户将无法观看直播回放，关闭后可重新开启回放。',
  },
};

export const openVideoPlaybackDialog = (options: IOptions) => {
  const { alias, status, onSuccess } = options;
  const config = playbackConfig[status];

  const handleClick = () => {
    Api.postPlaybackOpen({ alias })
      .then(() => {
        closeDialog(DIALOG_ID);
        onSuccess && onSuccess();
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  return openDialog({
    style: { width: '488px' },
    dialogId: DIALOG_ID,
    title: config.title,
    children: config.content,
    maskClosable: false,
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
