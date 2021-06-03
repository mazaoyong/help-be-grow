import React, { FC, useState, useEffect, useCallback } from 'react';
import { Icon } from '@youzan/ebiz-components';
import cx from 'classnames';
import { getAudioMetaInfo } from './api';
import './styles.scss';

interface IAudioProps {
  id?: number | string;
  audioUrl: string;
  mediaName: string;
  width?: string;
  height?: string;
}

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

const AudioComponent: FC<IAudioProps> = (props) => {
  const { audioUrl, width = '364px', height = '68px', mediaName, id } = props;
  let audioPlayer = (window as any).audioPlayer;

  const [duration, setduration] = useState('00:00');
  const [audioTime, setAudioTime] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!audioUrl) {
      return;
    }
    getAudioMetaInfo(audioUrl)
      .then(res => {
        if (res.data && res.data.format && res.data.format.duration) {
          setduration(formatSeconds(parseInt(res.data.format.duration)));
        }
      });

    if (!audioPlayer) {
      let audioNode = new Audio();
      audioNode.autoplay = false;
      audioNode.id = id + '';
      audioPlayer = audioNode;
    }
  }, [window, audioUrl, id]);

  const onAudioStop = useCallback(() => {
    if (!audioPlayer) {
      return;
    }
    const audioNode = audioPlayer;
    audioNode.pause();
    audioNode.src = '';
    onAudioChange();
  }, [audioPlayer]);

  const onAudioPause = useCallback(() => {
    if (!audioPlayer) {
      return;
    }
    const audioNode = audioPlayer;
    audioNode.pause();
    setActive(false);
  }, [audioPlayer]);

  // 进度
  const onAudioTimeUpdateChange = useCallback(() => {
    if (!audioPlayer) {
      return;
    }
    const { currentTime } = audioPlayer;
    setAudioTime(currentTime);
  }, [audioPlayer]);

  // 音频源改变
  const onAudioChange = useCallback(() => {
    if (!audioPlayer) {
      return;
    }
    const audioNode = audioPlayer;
    if (audioNode && (audioNode.src !== audioUrl || audioNode.id !== id + '')) {
      audioNode.removeEventListener('timeupdate', onAudioTimeUpdateChange);
      audioNode.removeEventListener('durationchange', onAudioChange);
      audioNode.removeEventListener('ended', onAudioStop);

      setActive(false);
      setAudioTime(0);
    }
  }, [audioPlayer, audioUrl, id, onAudioTimeUpdateChange, onAudioStop]);

  // 播放
  const onAudioPlay = useCallback(() => {
    if (!audioPlayer) {
      return;
    }
    const audioNode = audioPlayer;
    if (audioNode.src !== audioUrl || audioNode.id !== id + '') {
      audioNode.src = audioUrl;
      audioNode.id = id + '';

      audioNode.addEventListener('durationchange', onAudioChange);
      audioNode.addEventListener('ended', onAudioStop);
      audioNode.addEventListener('timeupdate', onAudioTimeUpdateChange);
    }
    setActive(true);

    audioPlayer.play();
  }, [audioPlayer, audioUrl, id, onAudioChange, onAudioStop, onAudioTimeUpdateChange]);

  return (<div style={{ width, height }} className={cx('audio-player', { 'play': active })} onClick={active ? onAudioPause : onAudioPlay}>
    <div className="controller">
      {active
        ? <Icon type="zantinganniu" size="24px"/>
        : <Icon type="bofanganniu" size="24px"/>
      }
    </div>
    <div className="info">
      <span className="text">{mediaName}</span>
      <span className="time">{audioTime !== 0 ? formatSeconds(parseInt(audioTime + '')) + ' / ' + duration : duration}</span>
    </div>
  </div>);
};

export default AudioComponent;
