import UA from 'zan-utils/browser/ua_browser';

function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}
function getReadableTime(seconds) {
  const minute = parseInt(seconds / 60, 10);
  const second = parseInt(seconds % 60);
  return `${minute}:${pad(second)}`;
}

export const VIS_AUDIO_STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
};

class VisMediaError extends Error {
  constructor({ message, code }) {
    super();

    this.message = message;
    this.code = code;
  }
}

export default class VisAudio {
  constructor({
    src = '',
    loop = false,
    preload = 'auto',
    muted = false,
    volume = 1,
    currentTime = 0,
    rate = 1,

    duration = 0,
    title = '',

    beforePlay = next => next(),
  }) {
    // if (!src) throw new Error('Must provide src.');

    this._duration = duration;
    this.title = title;

    const audio = new Audio();
    audio.defaultPlaybackRate = rate;
    // 素材给到的链接可能是 http 的，通不过安卓应用的安全检查
    src = src.replace(/http:/i, 'https:');
    audio.src = src;
    audio.preload = preload;
    audio.loop = loop;
    audio.muted = muted;
    audio.volume = volume;
    audio.currentTime = currentTime;
    this.instance = audio;

    this._listeners = {};
    this._onceListeners = {};
    this._registerHooks();

    this._hooks = {};
    this._hooks.beforePlay = beforePlay;

    this._status = VIS_AUDIO_STATUS.STOP;
    this.isLoading = false;
  }

  get status() {
    return this._status;
  }

  get readableCurrentTime() {
    return getReadableTime(this.currentTime);
  }

  get readableDuration() {
    return getReadableTime(this.duration);
  }

  get currentTime() {
    return this.instance.currentTime;
  }

  set currentTime(newCurrentTime) {
    this.instance.currentTime = newCurrentTime;
  }

  get duration() {
    return this._duration || this.instance.duration;
  }

  set duration(newDuration) {
    this._duration = newDuration;
  }

  get src() {
    return this.instance.src;
  }

  set src(newSrc) {
    this._initSource(newSrc);
  }

  get muted() {
    return this.instance.muted;
  }

  set muted(newMuted) {
    this.instance.muted = newMuted;
  }

  get volume() {
    return this.instance.volume;
  }

  set volume(newVolume) {
    this.instance.volume = newVolume;
  }

  get rate() {
    return this.instance.playbackRate;
  }

  set rate(newRate) {
    if (this.status === VIS_AUDIO_STATUS.STOP) {
      this.instance.defaultPlaybackRate = newRate;
    }

    this.instance.playbackRate = newRate;
  }

  get progress() {
    if (!this.duration) return 0;

    return +(this.instance.currentTime * 100 / this.duration).toFixed(2);
  }

  set progress(newProgress) {
    if (!this.duration) this.instance.currentTime = 0;

    try {
      this.instance.currentTime = this.duration * newProgress / 100;
    } catch (error) {}
  }

  get buffered() {
    const buffered = [];
    const _buffered = this.instance.buffered;
    for (let i = 0; i < _buffered.length; i++) {
      let buf = {};
      buf.start = _buffered.start(i);
      buf.end = _buffered.end(i);
      if (this.duration) {
        buf.startPercent = _buffered.start(i) / this.duration * 100;
        buf.endPercent = _buffered.end(i) / this.duration * 100;
      }
      buffered[i] = buf;
    }
    return buffered;
  }

  _initSource(newSrc) {
    newSrc = newSrc.replace(/http:/i, 'https:');
    const promise = this.pause();
    if (promise !== undefined) {
      promise.then(_ => {
        this.instance.src = newSrc;
      });
    } else {
      setTimeout(() => {
        this.instance.src = newSrc;
      }, 0);
    }
  }

  _registerHooks() {
    const _ = this.instance;

    _.addEventListener('loadedmetadata', () => {
      this._emit('loadedmetadata');
      this._duration = this.instance.duration;
    });

    _.addEventListener('canplay', () => {
      this._emit('canplay');
      if (!UA.isIOS) this._endLoading();
    });

    _.addEventListener('canplaythrough', () => {
      this._emit('canplaythrough');
      this._endLoading();
    });

    _.addEventListener('waiting', () => {
      this._emit('waiting');

      this._startLoading();
    });

    _.addEventListener('playing', () => {
      this._emit('playing');

      if (!UA.isIOS) this._endLoading();
    });

    _.addEventListener('play', () => {
      if (this.instance.readyState < 3 && this._status === VIS_AUDIO_STATUS.STOP) {
        this._startLoading();
      }

      this._status = VIS_AUDIO_STATUS.PLAY;
      this._emit('play');
      this._emit('statuschange');
    });

    _.addEventListener('timeupdate', () => {
      this._emit('timeupdate');
    });

    _.addEventListener('progress', () => {
      this._emit('progress');
    });

    _.addEventListener('pause', () => {
      this._status = VIS_AUDIO_STATUS.PAUSE;
      this._emit('pause');
      this._emit('statuschange');
    });

    _.addEventListener('ended', () => {
      this._status = VIS_AUDIO_STATUS.STOP;
      this._emit('ended');
      this._emit('statuschange');
    });

    _.addEventListener('durationchange', () => {
      this.duration = this.instance.duration;
    });

    _.addEventListener('error', () => {
      this._emit('error', _.error);
    });
  }

  _emit(eventName, arg) {
    (this._listeners[eventName] || []).forEach(cb => cb && cb(arg));
    const onceListenerIndexes = [];
    (this._onceListeners[eventName] || []).forEach((cb, index) => {
      if (cb) {
        cb(arg);
        onceListenerIndexes.push(index);
      }
    });
    onceListenerIndexes.forEach(index => {
      this._onceListeners[eventName].splice(index, 1);
    });
  }

  on(eventName, cb) {
    (this._listeners[eventName] || (this._listeners[eventName] = [])).push(cb);
  }

  once(eventName, cb) {
    (this._onceListeners[eventName] || (this._onceListeners[eventName] = [])).push(cb);
  }

  destroy() {
    // gc
    this.instance.stop();
  }

  forward(seconds) {
    this.instance.currentTime += seconds;
  }

  back(seconds) {
    this.instance.currentTime -= seconds;
  }

  seekByProgress(newProgress) {
    this.progress = newProgress;
  }

  seek(seconds) {
    this.instance.currentTime = seconds;
  }

  play() {
    this._hooks.beforePlay(() => this._play());
  }

  _play(src = '') {
    if (src) {
      this.instance.stop();
      setTimeout(() => {
        this.instance.src = src;
        this.instance.play();
      }, 0);
    } else {
      const promise = this.instance.play();
      if (promise !== undefined) {
        promise
          // .then(() => {
          //   console.log('播放开始');
          // })
          .catch(() => {
            let error = this.instance.error;
            if (!error) {
              error = new VisMediaError({
                message: 'Play failed, unknown error.',
                code: 100,
              });
            }
            this._emit('error', error);
          });
      }
    }
  }

  pause() {
    this.instance.pause();
  }

  stop() {
    this.instance.stop();
  }

  _startLoading() {
    this.isLoading = true;
    this._emit('loading');
  }

  _endLoading() {
    this.isLoading = false;
    this._emit('loaded');
  }
}
