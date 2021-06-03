import Vue from 'vue';
import { Toast } from 'vant';
import { throttle } from 'lodash';
import { resourceProtect } from 'pct/utils';
import UA from 'zan-utils/browser/ua_browser';

export const PCT_VIDEO_STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
  ENDED: 3,
};

export default class PctVideo {
  status = PCT_VIDEO_STATUS.STOP;
  currentTime = 0;
  duration = 0;
  videoEventBus = new Vue();

  percentage = 0;
  loadedPercentage = 0;
  loadedStartPercentage = 0;
  videoEl = null;
  isLoading = false;
  defaultStartTime = 0;

  canForward = true;
  canSetRate = true;

  get rate() {
    return this.videoEl.playbackRate;
  }

  set rate(newRate) {
    if (this.canSetRate) {
      this.videoEl.playbackRate = newRate;
      this.videoEl.defaultPlaybackRate = newRate;
    }
  }

  get buffered() {
    const buffered = [];
    const _buffered = this.videoEl.buffered;
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

  _setDefaultStartTime() {
    this.videoEl.currentTime = this.defaultStartTime;
  }

  on(...args) {
    this.videoEventBus.$on(...args);
  }

  emit(...args) {
    this.videoEventBus.$emit(...args);
  }

  setVideoEl(el, isVideoJs = false) {
    this.videoEl = el;
    this.isVideoJs = isVideoJs;
    this.initVideo();
  }

  pause = () => {
    if (!this.videoEl) return;
    this.videoEl.pause();
  }

  play = (current = 0, isAutoplay = false) => {
    this.isAutoplay = isAutoplay;

    if (!this.videoEl || resourceProtect.protectCallback()) {

    } else {
      // 恢复进度
      this.defaultStartTime = current;
      if (current) {
        this.currentTime = current;
        this.videoEl.currentTime = current;
      }
      if (this.status === PCT_VIDEO_STATUS.ENDED) {
        this.videoEl.currentTime = 0;
      }
      if (!(isAutoplay && this.isVideoJs)) {
        try {
          this.videoEl.play();
        } catch (_) {};
      }
      // 为了显示 loading
      if (this.videoEl.readyState < 2) {
        this.emit('waiting');
      }
      // if (this.status !== PCT_VIDEO_STATUS.STOP) {
      //   this.videoEl.play();
      //   return;
      // }

      // if (this.isVideoJs) {
      //   this.videoEl.play();
      // } else {
      //   const canplayOnce = () => {
      //     this.emit('canplay');
      //     this.videoEl.play();
      //     this.videoEl.removeEventListener('canplay', canplayOnce, false);
      //   };
      //   this.videoEl.addEventListener('canplay', canplayOnce, false);
      //   this.videoEl.load();
      //   this.emit('waiting');
      //   // hotfix: ios 部分手机无法播放视频
      //   // 防止canplay回调中调用play失效，代码可优化，问题待确定
      //   this.videoEl.play();
      // }
    }
  }

  grow = () => {
    const videoEl = this.videoEl;
    // 兼容多版本浏览器
    if (videoEl.webkitEnterFullscreen) {
      videoEl.webkitEnterFullscreen();
    } else if (videoEl.webkitRequestFullscreen) {
      videoEl.webkitRequestFullscreen();
    } else if (videoEl.mozRequestFullScreen) {
      videoEl.mozRequestFullScreen();
    } else if (videoEl.msRequestFullscreen) {
      videoEl.msRequestFullscreen();
    } else if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    }
  }

  shrink = () => {
    const videoEl = this.videoEl;
    // 兼容多版本浏览器
    if (videoEl.webkitExitFullscreen) {
      videoEl.webkitExitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // 更新播放进度
  updateProgress = (progress) => {
    if (!this.videoEl) return;
    this.videoEl.currentTime = parseInt(this.duration * progress / 100);
  }

  // 更新视频离当前播放时间最近的加载起点和加载进度
  updateLoadedPercentage() {
    let range = 0;
    const buffer = this.videoEl.buffered;
    const time = this.videoEl.currentTime;

    if (!buffer.length) return;

    // 取当前播放时间所在的那段buffer
    while (range < buffer.length && !(buffer.start(range) <= time && time <= buffer.end(range))) {
      range += 1;
    }
    // range不能超过buffer.length
    range = range === buffer.length ? range - 1 : range;
    const loadedStartPercentage = buffer.start(range) / this.durationSeconds * 100;
    const loadedEndPercentage = buffer.end(range) / this.durationSeconds * 100;
    const loadedPercentage = loadedEndPercentage - loadedStartPercentage;

    this.loadedStartPercentage = loadedStartPercentage;
    this.loadedPercentage = loadedPercentage > 100 ? 100 : loadedPercentage;
  }

  initVideo() {
    const video = this.videoEl;
    // 更新视频持续时间
    video.addEventListener('loadedmetadata', () => {
      this.duration = video.duration;
    });
    // 缓冲时显示loading
    video.addEventListener('waiting', () => {
      console.log('pct video is waiting');
      this.emit('waiting');
      this.isLoading = true;
    });
    // 可播放时隐藏loading
    video.addEventListener('canplay', () => {
      this.emit('canplay');
      this.isLoading = false;

      if (this.isAutoplay && this.isVideoJs) {
        this.videoEl.play();
      }
    });
    // 视频下载进度更新时，更新已下载的进度条
    video.addEventListener('progress', () => {
      this.updateLoadedPercentage();
    });
    // 更新时间轴
    video.addEventListener('timeupdate', () => {
      // 禁止快进
      if (!this.canForward && video.currentTime - this.currentTime >= 1) {
        video.currentTime = this.currentTime;
        Toast('该课程被限制快进，如有问题可联系客服');
      } else {
        this.currentTime = video.currentTime;
      }
    });
    // 记录进度
    video.addEventListener('timeupdate', throttle(() => {
      this.emit('progress', {
        current: video.currentTime,
        total: video.duration,
      });
    }, 200, { trailing: false }));
    // 播放结束后重置播放状态
    video.addEventListener('ended', () => {
      // 跳过结尾的广告
      if (UA.isAndroid()) {
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.currentTime = 0;
            video.pause();
          });
        }
      }

      this.emit('progress', {
        current: video.duration,
        total: video.duration,
        force: true,
      });

      this.status = PCT_VIDEO_STATUS.ENDED;
      this.emit('ended');
    });
    // 视频暂停时暂停
    video.addEventListener('pause', () => {
      this.status = PCT_VIDEO_STATUS.PAUSE;
      this.emit('video-pause');
    });

    video.addEventListener('play', () => {
      this.status = PCT_VIDEO_STATUS.PLAY;
      this.emit('play');
    });

    video.addEventListener('playing', () => {
      this.emit('playing');
    });

    video.addEventListener('loadeddata', () => {
      this.emit('loadeddata');
      this._setDefaultStartTime();
    });

    video.addEventListener('error', (err) => {
      console.warn('[video error]', JSON.stringify(err));
      this.emit('abnormal', {
        type: 'err', video,
      });
    });

    video.addEventListener('progress', () => {
      this.emit('buffered-update', this.buffered);
    });

    // 修复新版 TBS 无法设置初始播放位置的问题，仅排除掉 hls 视频（需注意）
    if (UA.isAndroid() && UA.isWeixin() && video.src.indexOf('.m3u8') < 0) {
      const defaultCurrentTimeSetter = () => {
        video.currentTime = this.defaultStartTime;
        video.removeEventListener('timeupdate', defaultCurrentTimeSetter);
      };
      video.addEventListener('timeupdate', defaultCurrentTimeSetter);
    }

    /**
     * 视频卡顿收集
     */
    try {
      var checkInterval = 1000.0; // check every 50 ms (do not use lower values)
      var lastPlayPos = 0;
      var currentPlayPos = 0;
      var bufferingDetected = false;
      var player = video;
      // 控制最大上报次数
      let maxSubmitCount = 3;
      let intervalHandler = null;

      const checkBuffering = () => {
        currentPlayPos = player.currentTime;

        // checking offset should be at most the check interval
        // but allow for some margin
        var offset = (checkInterval / 2) / 1000;

        // if no buffering is currently detected,
        // and the position does not seem to increase
        // and the player isn't manually paused...
        if (!bufferingDetected &&
          currentPlayPos < (lastPlayPos + offset) &&
          !player.paused) {
          console.warn('[video buffering]');
          maxSubmitCount--;
          if (maxSubmitCount > 0) {
            this.emit('video-abnormal', { type: 'hang', video });
          } else {
            intervalHandler && clearInterval(intervalHandler);
          }
          bufferingDetected = true;
        }

        // if we were buffering but the player has advanced,
        // then there is no buffering
        if (bufferingDetected &&
        currentPlayPos > (lastPlayPos + offset) &&
        !player.paused) {
          console.log('[video not buffering anymore]');
          bufferingDetected = false;
        }
        lastPlayPos = currentPlayPos;
      };

      intervalHandler = setInterval(checkBuffering, checkInterval);
    } catch (error) {
      console.warn('[hangError]', JSON.stringify(error));
      this.emit('video-abnormal', {
        type: 'exception',
        video,
        info: {
          err: JSON.stringify(error || {}),
        },
      });
    }
  }
}
