import { audio as ZanAudio } from '@youzan/zan-media-sdk';
import audioHelpers from 'common-api/audio';
const { getAudioInfo } = audioHelpers;

export function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

export function getReadableTime(seconds) {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  return `${minute}:${pad(second)}`;
}

export default {
  name: 'mixin-base-audio',

  props: {
    src: {
      type: String,
      default: '',
      required: true,
    },
    loop: { // 循环播放
      type: Boolean,
      default: false,
      required: false,
    },
    reloadWhenPause: { // 暂停后从头播放
      type: Boolean,
      default: false,
      required: false,
    },
    background: { // 播放时
      type: Boolean,
      default: true,
      required: false,
    },
    needFetchDuration: {
      type: Boolean,
      default: false,
    },
    needAutoLoad: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    // ui 组件能直接使用的属性
    return {
      zanAudio: null,
      paused: true,
      currentTime: 0,
      duration: 0,
      formattedCurrentTime: '0:00',
      formattedDuration: '0:00',
      formattedRemained: '0:00',
    };
  },

  computed: {
    percent() {
      return (this.currentTime / this.duration) * 100;
    },
    remainPercent() {
      return 100 - this.percent;
    },
  },

  // 初始化音频实例逻辑，请勿修改
  watch: {
    src: {
      immediate: true,
      handler(newSrc) {
        const {
          loop,
          reloadWhenPause,
          background,
        } = this;

        if (this.needFetchDuration) {
          getAudioInfo(newSrc).then(({ duration }) => {
            this.updateDuration(duration);
          });
        }

        const zanAudio = new ZanAudio({
          src: newSrc,
          loop,
          reloadWhenPause,
          background,
        });
        zanAudio.on('play', () => { this.paused = false; });
        zanAudio.on('pause', () => { this.paused = true; });
        zanAudio.on('timeupdate', () => {
          this.currentTime = zanAudio.element.currentTime;
          this.formattedCurrentTime = getReadableTime(this.currentTime);
          this.formattedRemained = getReadableTime(this.duration - this.currentTime);
        });
        zanAudio.on('loadedmetadata', () => {
          this.updateDuration(zanAudio.element.duration);
        });
        this.zanAudio = zanAudio;

        if (this.needAutoLoad) {
          zanAudio.load();
        }
      },
    },
  },

  // ui 组件能直接调用的方法
  methods: {
    updateDuration(duration) {
      this.duration = duration;
      this.formattedDuration = getReadableTime(duration);
      this.formattedRemained = getReadableTime(duration);
    },

    play() {
      if (!this.zanAudio) {
        return false;
      }
      this.zanAudio.play();
    },
    pause() {
      if (!this.zanAudio) {
        return false;
      }
      this.zanAudio.pause();
    },
    seek(seconds) {
      if (!this.zanAudio) {
        return false;
      }
      this.zanAudio.seek(seconds);
    },
  },
};
