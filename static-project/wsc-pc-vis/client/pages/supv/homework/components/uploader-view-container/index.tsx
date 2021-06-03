import * as React from 'react';
import cx from 'classnames';
import { IUploaderViewContainerProps } from './types';
import { IImgValue } from '../img-uploader/types';
import { IVideoValue } from '../video-uploader/types';
import { IAudioValue } from '../audio-uploader/types';
import ImgUploaderPreview from '../img-uploader-preview';
import VideoUploaderPreview from '../video-uploader-preview';
import AudioUploaderPreview from '../audio-uploader-preview';
import _findIndex from 'lodash/findIndex';
import { addIndex, removeIndex } from './utils';
import './style.scss';

const UploaderVideContainer: React.FC<IUploaderViewContainerProps> = (props) => {
  const [imgList, setImgList] = React.useState<IImgValue[]>(() => {
    document.addEventListener(`imgUploaderSingle-${props.anchor}`, (ev: any) => {
      const list = addIndex<IImgValue>(ev.detail.list);
      console.log('接收到来自 img-uploader-single 的消息', list);
      setImgList(list);
    });
    return [];
  });

  const [videoList, setVideoList] = React.useState<IVideoValue[]>(() => {
    document.addEventListener(`videoUploader-${props.anchor}`, (ev: any) => {
      const list = addIndex<IVideoValue>(ev.detail.list);
      console.log('接收到来自 videoUploader 的消息', list);
      setVideoList(list);
    });
    return [];
  });

  const [audioList, setAudioList] = React.useState<IAudioValue[]>(() => {
    document.addEventListener(`audioUploaderSingle-${props.anchor}`, (ev: any) => {
      const list = addIndex<IAudioValue>(ev.detail.list);
      console.log('接收到来自 audioUploader 的消息', list);
      setAudioList(list);
    });
    return [];
  });

  const dispatchEvent = React.useCallback(
    (list, type) => {
      const event = new CustomEvent(`uploaderViewContainer-${props.anchor}`, { 'detail': {
        list: list,
        type: type,
      } });
      document.dispatchEvent(event);
    },
    [props.anchor],
  );

  const handleDeleteImg = React.useCallback(
    (value) => {
      console.log('点击了删除', value);

      const deleteIndex = _findIndex(imgList, o => o.uploaderFileIndex === value.uploaderFileIndex);
      if (deleteIndex > -1) {
        imgList.splice(deleteIndex, 1);
        const listUsedByUploader = removeIndex(imgList);
        dispatchEvent(listUsedByUploader, 'image');
      }
    },
    [imgList, dispatchEvent],
  );

  const handleDeleteVideo = React.useCallback(
    (value) => {
      const deleteIndex = _findIndex(videoList, o => o.uploaderFileIndex === value.uploaderFileIndex);
      console.log('点击了删除', value, deleteIndex);
      if (deleteIndex > -1) {
        videoList.splice(deleteIndex, 1);
        const listUsedByUploader = removeIndex(videoList);
        dispatchEvent(listUsedByUploader, 'video');
      }
    },
    [videoList, dispatchEvent],
  );

  const handleDeleteAudio = React.useCallback(
    (value) => {
      const deleteIndex = _findIndex(audioList, o => o.uploaderFileIndex === value.uploaderFileIndex);
      console.log('点击了删除', value, deleteIndex);
      if (deleteIndex > -1) {
        audioList.splice(deleteIndex, 1);
        const listUsedByUploader = removeIndex(audioList);
        dispatchEvent(listUsedByUploader, 'audio');
      }
    },
    [audioList, dispatchEvent],
  );

  const containerClassName = cx('uploader-view-container', props.className);
  const imgArr = imgList?.map(item => item.url) || [];
  return (
    <div className={containerClassName}>
      {
        imgList.map((o, index) => {
          return (
            <ImgUploaderPreview
              key={`${o.url}_${index}`}
              imgArr={imgArr}
              url={o.url}
              showDeleteIcon={true}
              previewAnchor={`js_img-preview-${props.anchor}`}
              width={'80px'}
              height={'80px'}
              onDelete={() => handleDeleteImg(o)}
            />
          );
        })
      }
      {
        videoList.map((o, index) => {
          return (
            <VideoUploaderPreview
              key={`${o.url}_${index}`}
              url={o.url}
              width={'80px'}
              height={'80px'}
              videoId={o.videoId}
              coverUrl={o.coverUrl || ''}
              deleted={o.deleted}
              videoStatus={o.videoStatus}
              showDeleteIcon={true}
              onDelete={() => handleDeleteVideo(o)}
            />
          );
        })
      }
      {
        audioList.map((o, index) => {
          return (
            <AudioUploaderPreview
              key={`${o.url}_${index}`}
              url={o.url}
              audioId={o.audioId}
              showDeleteIcon={true}
              name={o.name}
              width={'264px'}
              onDelete={() => handleDeleteAudio(o)}
            />
          );
        })
      }
    </div>
  );
};

export default UploaderVideContainer;
