<template>
  <audio-controls
    :current-time="currentTime"
    :duration="duration"
    :is-play="isPlay"
    :progress="progress"
    :disabled="disabled"
    :buffered="buffered"
    @show-tip="onTipShow"
    @play="onCall('play')"
    @play-disabled="onPlayDisabled"
    @pause="onCall('pause')"
    @back="onCall('back', 15)"
    @forward="onCall('forward', 15)"
    @change-rate="onRateChange"
    @update-progress="onCall('seekByProgress', $event)"
  />
</template>

<script>
import { Toast } from 'vant';
import AudioControls from './AudioControls';
import VisAudio, { VIS_AUDIO_STATUS } from './VisAudio';
import { ZNB } from '@youzan/wxsdk';
import UA from 'zan-utils/browser/ua_browser';
import { resourceProtect } from 'pct/utils';
import rawAjax from 'captain-ajax';

let errorNo = 0;

export default {
  name: 'audio-with-controls',

  components: {
    AudioControls,
  },

  props: {
    src: String,
    isAutoPlay: Boolean,
    beforePlay: Function,
    latestProgress: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      audio: null,
      currentTime: '0:00',
      duration: '0:00',
      progress: 0,
      status: VIS_AUDIO_STATUS.STOP,
      disabled: false,
      buffered: [],
    };
  },

  computed: {
    isPlay() {
      return this.status === VIS_AUDIO_STATUS.PLAY;
    },
  },

  watch: {
    src(newSrc) {
      if (this.audio) {
        this.disabled = false;
        this.audio.src = newSrc;
        this.recoverProgress();
        if (this.isAutoPlay) this.play();
      }
    },
  },

  created() {
    this.init();
  },

  mounted() {
    if (this.isAutoPlay) this.play();
  },

  destroy() {
    this.audio.destroy();
    this.audio = null;
  },

  methods: {
    init() {
      let visAudio = null;
      try {
        visAudio = new VisAudio(this.$props);
      } catch (err) {
        console.warn(err);
        this.disabled = true;
        return;
      }

      // 恢复进度
      this.recoverProgress(visAudio);

      visAudio.on('loadedmetadata', () => {
        this.duration = visAudio.readableDuration;

        // 恢复进度功能体验的优化
        if (visAudio.duration - visAudio.currentTime < 1) {
          visAudio.currentTime = 0;
        }
      });
      visAudio.on('timeupdate', () => {
        this.currentTime = visAudio.readableCurrentTime;
        this.progress = visAudio.progress;
        this.$emit('progress', { current: visAudio.currentTime, total: visAudio.duration });
      });
      visAudio.on('progress', () => {
        this.buffered = visAudio.buffered;
      });
      visAudio.on('statuschange', () => {
        this.status = visAudio.status;
      });
      visAudio.on('play', () => {
        this.$emit('play');
      });
      visAudio.on('ended', () => {
        this.$emit('ended');
        this.$emit('progress', { current: visAudio.duration, total: visAudio.duration, force: true });
      });
      visAudio.on('loading', () => {
        this.$emit('loading');
      });
      visAudio.on('loaded', () => {
        this.$emit('loaded');
      });
      visAudio.on('error', (error) => {
        if (error instanceof MediaError) {
          if (this.src) {
            let message = '';
            switch (error.code) {
              case 3:
                message = '解码错误，自动修复中请稍后';
                this.try64k();
                break;
              case 4:
                this.try64k('不支持所提供的音频资源');
                break;
              default:
                message = `MediaError[${error.code}]`;
                break;
            }
            if (message) Toast(`出错了：${message}`);
          }
        } else if (error && error.code === 100) {
          Toast(`出错了：${error.message}`);
        }

        // 补充额外信息，用于上报
        error.extraInfo = {
          volume: visAudio.volume,
          muted: visAudio.muted,
          duration: visAudio.duration,
          currentTime: visAudio.currentTime,
          buffered: visAudio.buffered,
          status: visAudio.status,
          readyState: visAudio.instance && visAudio.instance.readyState,
          ua: navigator.userAgent,
          userActivation: navigator.userActivation || '',
          onLine: navigator.onLine || '',
          connection: navigator.connection && navigator.connection.effectiveType,
          no: errorNo++,
        };
        this.$emit('error', error);
      });
      this.audio = visAudio;

      if (!this.src) this.disabled = true;
    },

    recoverProgress(visAudio = this.audio) {
      if (!visAudio) return;

      // 恢复进度
      if (this.latestProgress && this.latestProgress.latest) {
        const latestProgress = this.latestProgress.latest;
        let { current = 0 } = latestProgress;

        // fuck ios
        const canplayFn = () => {
          visAudio.currentTime = current;

          if (visAudio.duration && visAudio.duration - visAudio.currentTime < 1) {
            visAudio.currentTime = 0;
          }
        };
        visAudio.once('canplay', canplayFn, false);
        visAudio.currentTime = current;

        // fuck ios again
        visAudio.duration = this.latestProgress.total || 0;
        this.duration = visAudio.readableDuration;
        this.progress = this.latestProgress.percent;
      }
    },

    play() {
      // 反盗判断
      if (resourceProtect.protectCallback()) {
        return;
      }

      const next = () => {
        this.audio.play();
      };

      // 播放前的守卫函数
      if (this.beforePlay && !this.isAutoPlay) {
        this.beforePlay(next);
      } else if (this.isAutoPlay && UA.isWeixin()) {
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
     * 尝试使用64k转码后的音频播放
     */
    try64k(message = '请使用其他浏览器播放或联系客服处理') {
      // 已经尝试过了就不再尝试，防止循环调用
      if (this.src && this.src.endsWith('@64k.mp3')) {
        Toast(message);
        return false;
      }

      if (this.src) {
        const newUrl = `${this.src}@64k.mp3`;

        rawAjax({
          url: `${newUrl}?avinfo`,
          noXRequestedWithHeader: true,
        })
          .then(() => {
            const instance = this.audio.instance;
            if (instance) {
              const currentTime = instance.currentTime;
              instance.src = newUrl;
              instance.currentTime = currentTime;

              if (this.audio.status !== VIS_AUDIO_STATUS.STOP) {
                instance.play();
              }
            }
          })
          .catch(() => {
            Toast(message);
          });
      }
    },

    onPlayDisabled() {
      // 反盗判断
      if (resourceProtect.protectCallback()) {
        console.log('仅在微信中访问');
      }
    },

    onCall(methodName, ...args) {
      if (!this.audio) return;
      if (methodName === 'play') return this.play();

      this.audio[methodName] && this.audio[methodName](...args);
    },

    onTipShow() {
      this.$emit('show-tip');
    },

    onRateChange(newRate) {
      if (!this.audio) return;

      this.audio.rate = newRate;
    },
  },
};
</script>
