import React, { useState, useCallback } from 'react';
import { Dialog, Notify, BlockLoading } from 'zent';
import ShareUrl from './components/share-url';
import ChannelInfo from './components/channel-info';
import AssistantManage from './components/assistant-manage';
import { ILiveAndAssistantLinkDTO } from './types';
import * as Api from './api';
import style from './style.m.scss';

const { openDialog } = Dialog;

const DIALOG_ID = 'VIDEO_SHARE_DIALOG';

interface IOptions {
  alias: string;
}
interface IProps extends ILiveAndAssistantLinkDTO, IOptions {}

const parseResult = (data: ILiveAndAssistantLinkDTO = {}) => {
  return {
    entryInfo: data.videoEnterInfoDTO || {},
    assistantEntryInfo: data.assistantEntryDTO || {},
  };
};

const VideoShareDialog: React.FC<IProps> = props => {
  const { alias } = props;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(parseResult(props));
  const { entryInfo, assistantEntryInfo } = state;

  const handleUpdate = useCallback(() => {
    setLoading(true);
    Api.getLiveEnterInfo({ alias })
      .then(data => {
        setState(parseResult(data));
      })
      .catch(error => {
        Notify.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [alias]);

  return (
    <BlockLoading className={style['video-share-dialog']} loading={loading}>
      <p className="video-share__title">讲师</p>
      <div className="video-share__item">
        <ShareUrl label="讲师链接：" url={entryInfo.url} />
        <ChannelInfo channelId={entryInfo.channelId} channelPassword={entryInfo.channelPassword} />
        {entryInfo.pushStreamUrl && (
          <ShareUrl label="推流地址：" url={entryInfo.pushStreamUrl} showQuickLink={false} />
        )}
      </div>
      <p className="video-share__title">助教</p>
      <AssistantManage alias={alias} onUpdate={handleUpdate} {...assistantEntryInfo} />
    </BlockLoading>
  );
};

export const openVideoShareDialog = ({ alias }: IOptions) => {
  Api.getLiveEnterInfo({ alias })
    .then(data => {
      openDialog({
        style: { width: '488px' },
        dialogId: DIALOG_ID,
        title: '前往直播',
        maskClosable: false,
        children: <VideoShareDialog alias={alias} {...data} />,
      });
    })
    .catch(error => {
      Notify.error(error);
    });
};
