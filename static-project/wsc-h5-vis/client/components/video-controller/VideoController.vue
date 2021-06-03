<template>
  <div class="cap-video-controller">
    <slot
      :videoEventBus="videoEventBus"
      :video="video"
      :currentTime="currentTime"
      :duration="duration"
      :percentage="percentage"
      :loadedPercentage="loadedPercentage"
      :loadedStartPercentage="loadedStartPercentage"
      :isFullscreen="isFullscreen"
      :isPlaying="isPlaying"
      :isStop="isStop"
      :isPause="isPause"
      :isLoading="isLoading"
      :isShowActions="isShowActions"
      :setVideoEl="setVideoEl"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { throttle } from 'lodash';

const STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
};
const ACTION_AUTO_HIDE_TIME = 5000;

export default {
  name: 'cap-video-controller',

  props: {
    autoPlay: Boolean,
    beforePlay: Function,
  },

  data() {
    return {
      percentage: 0,
      loadedPercentage: 0,
      loadedStartPercentage: 0,
      status: STATUS.STOP,
      currentTimeSeconds: 0,
      durationSeconds: 0,
      videoEventBus: null,
      video: null,
      autoHideTimer: null,
      isFullscreen: false,
      isLoading: false,
      isShowActions: false,
    };
  },

  computed: {
    isStop() {
      return this.status === STATUS.STOP;
    },
    isPlaying() {
      return this.status === STATUS.PLAY;
    },
    isPause() {
      return this.status === STATUS.PAUSE;
    },
    currentTime() {
      return this.getTime(this.currentTimeSeconds);
    },
    duration() {
      return this.getTime(this.durationSeconds);
    },
  },

  created() {
    const videoEventBus = new Vue();
    videoEventBus.$on('video:pause', this.autoHideTimerDecorator(this.pause));
    videoEventBus.$on('video:play', this.autoHideTimerDecorator(this.play));
    videoEventBus.$on('video:progress:update', this.autoHideTimerDecorator(this.updateProgress));
    videoEventBus.$on('video:progress:start', this.onProgressStart);
    videoEventBus.$on('video:progress:end', this.onProgressEnd);
    videoEventBus.$on('video:fullscreen:toggle', this.autoHideTimerDecorator(this.toggleFullscreen));
    videoEventBus.$on('video:actions:toggle', this.toggleActions);
    this.videoEventBus = videoEventBus;
  },

  methods: {
    // 小于10的数左边补0
    pad(number) {
      return number < 10 ? `0${number}` : `${number}`;
    },
    // 将秒数转化为“分:秒”的形式
    getTime(seconds) {
      const minute = parseInt(seconds / 60, 10);
      const second = Math.round(seconds % 60);
      return `${this.pad(minute)}:${this.pad(second)}`;
    },
    setVideoEl(el) {
      this.video = el;
      this.initVideo();
    },
    pause() {
      if (!this.video) return;
      this.video.pause();
      this.status = STATUS.PAUSE;
      this.$emit('video-pause');
    },
    play(current = 0) {
      if (!this.video) {

      } else {
        const next = () => {
          // 恢复进度
          if (current) this.video.currentTime = current;
          this.video.play();
          this.status = STATUS.PLAY;
          this.$emit('video-play');
        };

        // 播放前守卫
        if (this.beforePlay && !this.autoPlay) {
          this.beforePlay(next);
        } else {
          next();
        }
      }
    },
    // 更新播放进度
    updateProgress(percentage) {
      if (!this.video) return;
      this.video.currentTime = parseInt(this.durationSeconds * percentage / 100);
    },
    toggleFullscreen(isFullscreen) {
      this.isFullscreen = isFullscreen;
      this.$emit('video-fullscreen-toggle', isFullscreen);
    },
    toggleActions(isShowActions) {
      console.log('isShowActions', isShowActions);
      this.isShowActions = isShowActions;

      if (isShowActions) {
        this.clearAutoHideActionTimer();
        this.runAutoHideActionTimer();
      }
    },
    // 拖动进度条时不隐藏操作按钮
    onProgressStart() {
      this.clearAutoHideActionTimer();
    },
    // 拖动进度条结束后隐藏操作按钮
    onProgressEnd() {
      this.runAutoHideActionTimer();
    },
    // 自动隐藏操作按钮的装饰函数
    autoHideTimerDecorator(fn) {
      return (...args) => {
        const result = fn.apply(this, args);

        this.resetAutoHideTimer();
        return result;
      };
    },
    resetAutoHideTimer() {
      this.clearAutoHideActionTimer();
      this.runAutoHideActionTimer();
    },
    // 清除自动隐藏操作按钮的计时器
    clearAutoHideActionTimer() {
      clearTimeout(this.autoHideTimer);
    },
    // 启动自动隐藏操作按钮的计时器
    runAutoHideActionTimer() {
      this.autoHideTimer = setTimeout(() => {
        this.isShowActions = false;
      }, ACTION_AUTO_HIDE_TIME);
    },
    // 更新视频离当前播放时间最近的加载起点和加载进度
    updateLoadedPercentage() {
      let range = 0;
      const buffer = this.video.buffered;
      const time = this.video.currentTime;

      if (!buffer.length) return;

      // 取当前播放时间所在的那段buffer
      while (!(buffer.start(range) <= time && time <= buffer.end(range))) {
        range += 1;
      }
      const loadedStartPercentage = buffer.start(range) / this.durationSeconds * 100;
      const loadedEndPercentage = buffer.end(range) / this.durationSeconds * 100;
      const loadedPercentage = loadedEndPercentage - loadedStartPercentage;

      this.loadedStartPercentage = loadedStartPercentage;
      this.loadedPercentage = loadedPercentage;
    },
    initVideo() {
      const video = this.video;
      // 更新视频持续时间
      video.addEventListener('loadedmetadata', () => {
        this.durationSeconds = video.duration;
      });
      // 缓冲时显示loading
      video.addEventListener('waiting', () => {
        this.isLoading = true;
      });
      // 可播放时隐藏loading
      video.addEventListener('canplay', () => {
        this.isLoading = false;
      });
      // 视频下载进度更新时，更新已下载的进度条
      video.addEventListener('progress', () => {
        this.updateLoadedPercentage();
      });
      // 更新时间轴
      video.addEventListener('timeupdate', () => {
        this.currentTimeSeconds = video.currentTime;
        this.percentage = Math.min(this.currentTimeSeconds / this.durationSeconds * 100, 100) || 0;
      });
      // 记录进度
      video.addEventListener('timeupdate', throttle(() => {
        this.$emit('progress', {
          current: video.currentTime,
          total: video.duration,
        });
      }, 200, { trailing: false }));
      // 播放结束后重置播放状态
      video.addEventListener('ended', () => {
        this.$emit('progress', {
          current: video.duration,
          total: video.duration,
        });

        this.status = STATUS.STOP;
        this.$emit('video-end');
      });
      // 视频暂停时暂停
      video.addEventListener('pause', () => {
        this.pause();
      });
    },
  },
};
</script>

<style lang="css">

</style>
