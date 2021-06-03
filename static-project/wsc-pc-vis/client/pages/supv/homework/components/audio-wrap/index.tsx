import { Pop } from '@zent/compat';
import * as React from 'react';

import { Icon } from '@youzan/ebiz-components';
import { audio as ZanAudio } from '@youzan/zan-media-sdk';
import throttle from 'lodash/throttle';
import { Slider, InlineLoading } from 'zent';
import { IAudioWrapProps } from './types';
import { removePx, secondsToColonTime } from './utils';
import './style.scss';

const storeAudioIns: ZanAudio[] = [];

const AudioWrap: React.FC<IAudioWrapProps> = (props) => {
  const singlePlay = props.singlePlay || true;
  const audioRef = React.useRef<ZanAudio>();

  const [playing, setPlaying] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [time, setTime] = React.useState(0);

  const [duration, setDuration] = React.useState('0:00');

  const [currentTime, setCurrentTime] = React.useState('0:00');

  const [progress, setProgress] = React.useState(0);

  const init = () => {
    const audio = new ZanAudio({
      src: props.src,
      getInfoFromCdn: true,
      autoplay: false,
      // @ts-ignore
      enableErrorHandler: true,
    });

    singlePlay && storeAudioIns.push(audio);

    audio.on('play', () => {
      setPlaying(true);
      props.onPlay && props.onPlay();
    });
    audio.on('pause', () => {
      setPlaying(false);
      props.onPause && props.onPause();
    });
    audio.on('ended', () => {
      props.onEnded && props.onEnded();
    });
    audio.on('durationchange', () => {
      setTime(audio.duration);
      setDuration(secondsToColonTime(audio.duration));
    });
    audio.on('timeupdate', throttle(() => {
      setCurrentTime(secondsToColonTime(audio.currentTime));
      // if (!this.dragging) {
      setProgress(audio.progress * 100);
      // }
      props.onTimeupdate && props.onTimeupdate(audio);
      setLoading(false);
    }, 200));
    audio.on('loading', () => {
      setLoading(true);
    });
    audio.on('loaded', () => {
      setLoading(false);
    });
    audio.on('error', () => {
      const { element } = audio;
      if (!element ||
        !element.error ||
        (element.error.code !== 3 && element.error.code !== 4)
      ) {
        // Toast('加载资源失败，请重试');
        console.log('加载资源失败，请重试');
      }
      setLoading(false);
      props.onError && props.onError();
    });

    audioRef.current = audio;
  };

  React.useEffect(() => {
    init();
    return () => {
      // Clean up the subscription
      audioRef.current && audioRef.current.stop();
    };
  }, []);

  const handleSliderChange = React.useCallback((value) => {
    console.log('slider change', value);
    audioRef.current && audioRef.current.seek(Math.floor(time * value / 100));
  }, [time]);

  const play = React.useCallback(() => {
    singlePlay && pauseAll();
    audioRef.current && audioRef.current.play();
  }, []);

  const pause = React.useCallback(() => {
    audioRef.current && audioRef.current.pause();
  }, []);

  const pauseAll = () => {
    storeAudioIns.filter(o => !!o).map(o => {
      o && o.pause();
    });
  };

  const TriggerElm = React.useCallback(() => {
    let elm: React.ReactElement;
    if (loading) {
      elm = (
        <InlineLoading loading icon="circle" iconSize={24} iconText="" />
      );
    } else if (playing) {
      elm = (
        <span onClick={pause}>
          <Icon type="zantinganniu" size="24px" />
        </span>
      );
    } else {
      elm = (
        <span onClick={play}>
          <Icon type="bofanganniu" size="24px"/>
        </span>
      );
    }
    return elm;
  }, [playing, loading, play, pause]);

  return (
    <div className="audio-wrap"
      style={{
        width: props.width,
      }}
    >
      <div className="audio-wrap__container">
        <div className="audio-wrap__trigger">
          <TriggerElm />
        </div>
        <div
          className="audio-wrap__content"
          style={
            {
              width: (removePx(props.width) - 84) + 'px',
            }
          }
        >
          <Pop trigger="hover" content={props.name}>
            <div className="audio-wrap__name">{props.name}</div>
          </Pop>
          <div className="audio-wrap__progress-container">
            <div className="audio-wrap__progress-container-currtime">{currentTime}</div>
            <div className="audio-wrap__progress-container">
              <Slider width={(removePx(props.width) - 172) + 'px'} withInput={false} value={progress} onChange={handleSliderChange} className='audio-wrap__slider' />
            </div>
            <div className="audio-wrap__progress-container-totaltime">{duration}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioWrap;
