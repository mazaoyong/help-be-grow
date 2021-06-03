import React, { FC, useEffect, useRef } from 'react';
import { Icon, Dialog } from 'zent';
import Img from '../img';
import { video as VisVideo } from '@youzan/zan-media-sdk';
import { IVideoPreviewParam } from './types';
import './style.scss';

const VIDEO_DELETE_URL: string = 'https://img.yzcdn.cn/public_files/2019/10/12/video_delete.png';
const { openDialog, closeDialog } = Dialog;
const { ImgWrap } = Img;

const VideoPlayer: FC<IVideoPreviewParam> = (props) => {
  const { url } = props;

  let domRef = useRef<HTMLVideoElement>(null);
  // const [ready, setReady] = useState(false);
  useEffect(() => {
    if (domRef.current) {
      const MP4 = new VisVideo(domRef.current, {});
      MP4.setAttributes({
        controls: 'true',
      });
      MP4.addSource(url);
      MP4.loadSource({ autoPlay: true });
    }
  }, [url]);

  return (
    <div>
      <video
        ref={domRef}
        data-testid="video-player"
        id="moments_video_player"
        className="video_player"
        preload="none"
        src={url}
      />
    </div>
  );
};

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const _seconds = seconds - minutes * 60;
  let min = minutes + '';
  let sec = _seconds + '';
  if (minutes < 10) {
    min = `0${minutes}`;
  }
  if (_seconds < 10) {
    sec = `0${_seconds}`;
  }
  return min + ':' + sec;
};

const VideoComponent: FC<IVideoPreviewParam> = (props) => {
  const { coverUrl, width = '100px', height = '56px', deleted = false, duration } = props;

  const openVideoPlayer: () => void = () => {
    openDialog({
      dialogId: 'video_player_dialog',
      closeBtn: false,
      className: 'video_player_dialog',
      children: <VideoPlayer {...props} />,
      onClose: () => {
        closeDialog('video_player_dialog');
      },
    });
  };

  const watermark = duration ? formatSeconds(duration) : '';

  return (
    <div
      style={{ width, height }}
      data-testid="video-warpper"
      className="video-player-wrap"
      onClick={!deleted ? openVideoPlayer : undefined}
    >
      <Icon type="video-guide" className="video__headImg__icon" />
      <ImgWrap
        width={width}
        height={height}
        src={!deleted ? coverUrl : VIDEO_DELETE_URL}
        cover
        watermark={watermark}
      />
    </div>
  );
};

export default VideoComponent;

export * from './types';
