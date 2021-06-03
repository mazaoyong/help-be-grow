import { Toast } from 'vant';

export const PLAY_STATUS = {
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop',
  ENDED: 'ended',
  FAIL: 'fail',
};

export const BUFFER_STATUS = {
  WAITING: 'waiting',
  CANPLAY: 'canplay',
};

let id = 1;
export default function getInnerAudioContext(src, cbs, { startTime = 0, autoplay = false, loop = false } = {}) {
  if (!src) {
    Toast('音频源错误');
    return;
  }

  // 初始化
  const audio = document.createElement('audio');
  audio.id = id++;
  audio.src = src;
  audio.status = PLAY_STATUS.STOP;
  audio.bufferStatus = BUFFER_STATUS.WAITING;
  audio.obeyMuteSwitch = false;
  // 默认设置
  audio.startTime = startTime;
  audio.autoplay = autoplay;
  audio.loop = loop;

  // 设置监听器
  audio.addEventListener('canplay', () => {
    audio.bufferStatus = BUFFER_STATUS.CANPLAY;
    cbs.onBufferStatusChange && cbs.onBufferStatusChange(BUFFER_STATUS.CANPLAY);
  });
  // audio.oncanplay(() => {
  //   audio.bufferStatus = BUFFER_STATUS.CANPLAY;
  //   cbs.onBufferStatusChange && cbs.onBufferStatusChange(BUFFER_STATUS.CANPLAY);
  // });

  audio.addEventListener('play', () => {
    audio.status = PLAY_STATUS.PLAY;
    cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.PLAY);
  });
  // audio.onplay(() => {
  //   audio.status = PLAY_STATUS.PLAY;
  //   cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.PLAY);
  // });

  audio.addEventListener('pause', () => {
    audio.status = PLAY_STATUS.PAUSE;
    cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.PAUSE);
  });
  // audio.onpause(() => {
  //   audio.status = PLAY_STATUS.PAUSE;
  //   cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.PAUSE);
  // });

  audio.addEventListener('stop', () => {
    audio.status = PLAY_STATUS.STOP;
    cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.STOP);
  });
  // audio.onstop(() => {
  //   audio.status = PLAY_STATUS.STOP;
  //   cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.STOP);
  // });

  audio.addEventListener('ended', () => {
    audio.status = PLAY_STATUS.ENDED;
    cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.ENDED);
  });
  // audio.onended(() => {
  //   audio.status = PLAY_STATUS.ENDED;
  //   cbs.onStatusChange && cbs.onStatusChange(PLAY_STATUS.ENDED);
  // });

  let waitUpdate = false;

  audio.addEventListener('timeupdate', () => {
    if (waitUpdate) return;

    waitUpdate = true;
    setTimeout(() => {
      waitUpdate = false;
      cbs.onTimeUpdate && cbs.onTimeUpdate(audio.currentTime);
    }, 500);
  });
  // audio.ontimeupdate(() => {
  //   if (waitUpdate) return;

  //   waitUpdate = true;
  //   setTimeout(() => {
  //     waitUpdate = false;
  //     cbs.onTimeUpdate && cbs.onTimeUpdate(audio.currentTime);
  //   }, 500);
  // });

  audio.addEventListener('error', (err) => {
    audio.status = PLAY_STATUS.FAIL;
    cbs.onError && cbs.onError(err);
  });
  // audio.onerror((err) => {
  //   audio.status = PLAY_STATUS.FAIL;
  //   cbs.onError && cbs.onError(err);
  // });

  audio.addEventListener('waiting', () => {
    audio.bufferStatus = BUFFER_STATUS.WAITING;
    cbs.onBufferStatusChange && cbs.onBufferStatusChange(BUFFER_STATUS.WAITING);
  });
  // audio.onwaiting(() => {
  //   audio.bufferStatus = BUFFER_STATUS.WAITING;
  //   cbs.onBufferStatusChange && cbs.onBufferStatusChange(BUFFER_STATUS.WAITING);
  // });

  audio.addEventListener('seeking', () => {
    audio.pause();
  });
  // audio.onseeking(() => {
  //   audio.pause();
  // });

  audio.addEventListener('seeked', () => {
    audio.play();
  });
  // audio.onseeked(() => {
  //   audio.play();
  // });

  return audio;
}
