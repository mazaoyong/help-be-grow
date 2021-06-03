<template>
  <div class="audio-controller">
    <slot
      :audioEventBus="audioEventBus"
      :percentage="percentage"
      :isStop="isStop"
      :duration="duration"
      :formatedCurrentTime="formatedCurrentTime"
      :formatedDuration="formatedDuration"
      :isPlaying="isPlaying"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import audioHelpers from 'common-api/audio';
import { ZNB } from '@youzan/wxsdk';
import UA from 'zan-utils/browser/ua_browser';
import { resourceProtect } from 'pct/utils';

const { getAudioInfo } = audioHelpers;

const STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
};
const FORWARD_BACK_STEP = 15;

export default {
  name: 'audio-controller',

  props: {
    audioUrl: {
      type: String,
      default: '',
    },
    audioTitle: String,
    beforePlay: Function,
    autoPlay: Boolean,
    progress: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      percentage: 0,
      status: STATUS.STOP,
      currentTime: 0,
      duration: 0,
      audio: null,
      audioEventBus: null,
    };
  },

  computed: {
    isPlaying() {
      return this.status === STATUS.PLAY;
    },
    isStop() {
      return this.status === STATUS.STOP;
    },
    formatedCurrentTime() {
      return this.getTime(this.currentTime);
    },
    formatedDuration() {
      return this.getTime(this.duration);
    },
  },

  watch: {
    audioUrl(val) {
      if (!val) return;
      this.resetAudio();
      this.loadAudio();
    },
  },

  created() {
    var audioEventBus = new Vue();
    audioEventBus.$on('audio:play', this.play);
    audioEventBus.$on('audio:pause', this.pause);
    audioEventBus.$on('audio:forward', this.forward);
    audioEventBus.$on('audio:back', this.back);
    audioEventBus.$on('audio:replay', this.replay);
    audioEventBus.$on('audio:reset', this.reset);
    audioEventBus.$on('audio:progress:update', this.updateProgress);
    audioEventBus.$on('audio:tip', this.showTip);

    this.audioEventBus = audioEventBus;
    this.audioUrl && this.loadAudio();
  },

  destroyed() {
    this.audio.pause();
    this.audio = null;
  },

  methods: {
    /**
     * 小于10的数左边补0
     * @param  {number} number 需要补0的数
     * @return {string}        处理后的结果
     */
    pad(number) {
      return number < 10 ? `0${number}` : `${number}`;
    },
    /**
     * 将秒数转化为“分:秒”的形式
     * @param  {number} seconds 秒数
     * @return {string}         转化结果
     */
    getTime(seconds) {
      const minute = parseInt(seconds / 60, 10);
      const second = parseInt(seconds % 60);
      return `${this.pad(minute)}:${this.pad(second)}`;
    },
    /**
     * 播放音频
     */
    play() {
      // 反盗判断
      if (resourceProtect.protectCallback()) {
        return;
      }

      if (!this.audio) {
        this.$emit('needToBuy', '当前内容需要购买后才能收听哦');
        return;
      }

      const next = () => {
        this.audio.play();
        this.status = STATUS.PLAY;
        this.$emit('audioPlaying');
      };

      // 播放前的守卫函数
      if (this.beforePlay && !this.autoPlay) {
        this.beforePlay(next);
      } else if (this.autoPlay && UA.isWeixin()) {
        ZNB.getWx().then(wx => {
          wx.getNetworkType({
            success: (res) => {
              next();
            },
            fail(msg) {
              console.warn(JSON.stringify(msg));
            },
          });
        });
      } else {
        next();
      }
    },
    /**
     * 暂停音频
     */
    pause() {
      if (!this.audio) return;
      this.audio.pause();
      this.status = STATUS.PAUSE;
    },
    /**
     * 快进
     */
    forward() {
      if (!this.audio) return;
      this.audio.currentTime += FORWARD_BACK_STEP;
    },
    /**
     * 快退
     */
    back() {
      if (!this.audio) return;
      this.audio.currentTime -= FORWARD_BACK_STEP;
    },
    /**
     * 重播音频
     */
    replay() {
      if (!this.audio) return;
      this.audio.currentTime = 0;
      this.play();
    },
    /**
     * 重置音频
     */
    resetAudio() {
      if (!this.audio) return;
      this.pause();
      this.audio.currentTime = 0;
      this.status = STATUS.STOP;
    },
    /*
     * 销毁音频
     */
    destroy() {
      this.pause();
      this.audio = null;
    },
    /**
     * 显示置顶提示
     */
    showTip() {
      if (!this.audio) return;
      this.$emit('showTip');
    },
    /**
     * 播放进度跳转
     * @param  {number} percentage 播放进度百分比
     */
    updateProgress(percentage) {
      if (!this.audio) return;
      this.audio.currentTime = parseInt(this.duration * percentage / 100);
    },
    loadAudio() {
      const audio = this.audio = document.createElement('audio');

      // 获取音频时长
      getAudioInfo(this.audioUrl).then(({ url, duration }) => {
        audio.src = url;
        audio.title = this.audioTitle;
        this.duration = duration;

        // 恢复进度
        if (this.progress && this.progress.latest) {
          const latestProgress = this.progress.latest;
          let { current = 0 } = latestProgress;

          if (duration - current < 1) current = 0;
          // fuck ios
          const canplayFn = () => {
            audio.currentTime = current;
            audio.removeEventListener('canplay', canplayFn, false);
          };
          audio.addEventListener('canplay', canplayFn, false);
          audio.currentTime = current;
          this.currentTime = current;
          this.percentage = Math.min(current / duration * 100, 100);
        }

        // 更新时间轴
        audio.addEventListener('timeupdate', () => {
          if (this.isStop) return;

          this.currentTime = audio.currentTime;
          this.percentage = Math.min(this.currentTime / this.duration * 100, 100);

          this.$emit('progress', { current: this.currentTime, total: this.duration });
        });
        // 播放结束后重置播放状态
        audio.addEventListener('ended', () => {
          this.$emit('progress', {
            current: duration,
            total: duration,
          });

          this.status = STATUS.PAUSE;
          this.$emit('audioEnd');
        });

        if (this.autoPlay) this.play();
      });
    },
  },
};
</script>
