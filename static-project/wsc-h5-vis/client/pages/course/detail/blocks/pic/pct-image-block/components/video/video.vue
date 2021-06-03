<template>
  <div class="vis-video">
    <div v-show="showControl" class="feedback-icon">
      <a href="/wscvis/feedback?from-type=force">反馈</a>
    </div>
    <video
      v-show="status !== STATUS.END"
      ref="video"
      class="vis-video__element"
      playsinline
      webkit-playsinline
      x5-playsinline
      controlsList="nodownload"
      :controls="false"
    >
      当前浏览器不支持最新的video播放
    </video>
    <i
      v-show="status === STATUS.UNSTART || status === STATUS.END"
      class="vis-video__bg-img"
      :style="{ backgroundImage: `url(${cover})` }"
    />
    <div class="vis-video__control" @click="toggleControl">
      <van-loading
        v-if="loading"
        type="spinner"
        size="50px"
      />
      <slot v-else-if="status === STATUS.UNSTART" name="play" :play="trigger(onStart, null, true)">
        <van-icon
          name="play-circle-o"
          size="50px"
          @click="trigger(onStart)"
        />
      </slot>
      <slot v-else-if="status === STATUS.END" name="replay" :replay="trigger(onStart, null, true)">
        <van-icon
          name="replay"
          size="24px"
          @click="trigger(onStart)"
        />
      </slot>
      <slot />
      <div v-if="status === STATUS.PLAYING || status === STATUS.PAUSE">
        <transition name="fade">
          <div v-show="showControl" class="vis-video__control_bottom">
            <van-icon
              class="vis-video__control_bottom_play"
              :name="status === STATUS.PAUSE ? 'play' : 'pause'"
              size="18px"
              @click.stop="trigger(togglePlay)"
            />
            <span class="vis-video__control_bottom_time">{{ currentTime }}</span>
            <div class="vis-video__control_bottom_slider">
              <van-slider
                :value="progress"
                active-color="#00b389"
                inactive-color="#fff"
                @change="trigger(sliderChange, $event)"
                @drag-start="onDragStart"
                @input="onDragging"
                @drag-end="onDragEnd"
              >
                <i slot="button" class="vis-video__control_bottom_slider_btn" />
              </van-slider>
            </div>
            <span class="vis-video__control_bottom_time">{{ duration }}</span>
            <span
              v-if="showRateBtn"
              class="vis-video__control_bottom_rate"
              @click.stop="showRatePanel"
            >
              {{ currentRate }}
            </span>
            <van-icon
              class="vis-video__control_bottom_screen"
              name="expand-o"
              size="18px"
              @click.stop="trigger(toggleScreen)"
            />
          </div>
        </transition>
        <transition name="fade">
          <div v-show="showRate" class="vis-video__control_rate">
            <span
              v-for="rate in RATE"
              :key="rate"
              v-theme.main="isCurrentRate(rate) ? 'color' : ''"
              :class="{ current: isCurrentRate(rate) }"
              class="vis-video__control_rate_item"
              @click.stop="switchRate(rate)"
            >
              {{ rate }}X
            </span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Slider, Icon, Dialog, Toast } from 'vant';
import ua from '@youzan/utils/browser/ua';
import { video as ZanVideo } from '@youzan/zan-media-sdk';
import getNetworkType from '@/pages/course/detail/utils/get-network-type';
import { isX5 } from '@/common/utils/env';

import { VIDEO_PLAY_RATE as RATE } from '../../constants';

const STATUS = {
  UNSTART: 1,
  PLAYING: 2,
  PAUSE: 3,
  END: 4,
};

let timeout = null;

function getReadableTime(seconds) {
  const pad = number => number < 10 ? `0${number}` : `${number}`;
  const hour = Math.floor(seconds / (60 * 60));
  const minute = Math.floor(seconds % (60 * 60) / 60);
  const second = Math.floor(seconds % 60);
  if (hour) {
    return `${hour}:${pad(minute)}:${pad(second)}`;
  }
  return `${minute}:${pad(second)}`;
}

export default {
  components: {
    'van-icon': Icon,
    'van-loading': Loading,
    'van-slider': Slider,
  },

  props: {
    src: {
      type: String,
      default: '',
    },
    startAt: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: String,
      default: '',
    },
    networkType: {
      type: String,
      default: '',
    },
    canForward: {
      type: Boolean,
      default: true,
    },
    playRate: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      STATUS,
      RATE,
      showControl: false,
      showRate: false,
      currentRate: '倍速',
      progress: 0,
      loading: false,
      status: STATUS.UNSTART,
      fullScreen: false,
      currentTime: '0:00',
      duration: '0:00',
      time: 0,
      dragging: false,
      // 标志是否是第一次加载视频
      // 需要视频播放开始才能加载视频，防止盗链
      isFirstLoad: true,
    };
  },

  computed: {
    isAndroid() {
      return ua.isAndroid();
    },
    isWeixin() {
      return ua.isWeixin();
    },

    showRateBtn() {
      const { src = '' } = this;
      const isHLS = src.indexOf('.m3u8') > -1;
      let showRateBtn = true;

      // 安卓平台非x5内核浏览器，不提供倍速播放功能
      if (isHLS) {
        showRateBtn = !(this.isAndroid && !isX5());
      }

      // 安卓微信下不展示
      return this.canForward && showRateBtn;
    },
  },

  watch: {
    playRate(newRate) {
      if (this.isCurrentRate(newRate)) {
        return;
      }
      this.switchRate(newRate);
    },
    src(newSrc) {
      if (newSrc) {
        if (this.video) {
          this.video.switch(newSrc, { autoPlay: this.autoplay });
        } else {
          this.init(newSrc);
        }
      }
    },

    showControl(val) {
      if (val) {
        this.delayHideControl();
      }
    },
  },

  mounted() {
    if (this.src) {
      this.init(this.src);
    }
  },

  methods: {
    init(src) {
      this.video = new ZanVideo(this.$refs.video, {
        x5Player: false,
        // 日志增加节流设置
        logger: {
          consoleLog: false,
          uploader: {
            maxEntries: 100,
          },
        },
      });
      this.video.on('loadSource', () => {
        this.loading = true;
      });
      this.video.on('canplay', () => {
        this.loading = false;
      });
      this.video.on('loading', () => {
        this.loading = true;
      });
      this.video.on('playing', () => {
        this.showControl = true;
        this.loading = false;
        this.status = STATUS.PLAYING;
        this.$emit('play');
      });
      this.video.on('pause', () => {
        this.video.$video.controls = false;
        this.status = STATUS.PAUSE;
        this.$emit('pause');
      });
      // 暂时不能加 throttle ，因为会导致 ended 事件可能不触发，需要 video 暴露 ended 事件
      this.video.on('timeUpdate', status => {
        const { current, duration } = status;
        if (current && duration) {
          this.time = duration;
          this.currentTime = getReadableTime(status.current);
          this.duration = getReadableTime(status.duration);
          if (!this.dragging) {
            this.progress = +(current * 100 / duration).toFixed(2);
          }
          if (current === duration) {
            setTimeout(() => {
              // 结束会触发 pause 事件，所以这里需要滞后处理
              this.status = STATUS.END;
            }, 0);
            this.$emit('ended');
          }
          this.$emit('timeupdate', status);
        }
      });
      this.video.on('error', e => {
        Toast('加载资源失败，请重试');
        this.loading = false;
        this.$emit('error', e);
      });
    },

    onDragStart() {
      this.delayHideControl();
      this.dragging = true;
    },

    onDragging(value) {
      this.delayHideControl();
      this.progress = value;
    },

    onDragEnd() {
      this.delayHideControl();
      this.dragging = false;
    },

    // vue 的 slot-scope 能力，把 function 传递到 slot 中时，如果在模版中使用类似 fn() 语法，会直接执行
    // 所以这里加一个参数 returnFunc 来避免 slot-scope 中的函数直接执行
    trigger(fn, event, returnFunc) {
      const func = () => {
        if (this.video) {
          fn(event);
        }
      };
      if (returnFunc) {
        return func;
      }
      func();
    },

    onStart() {
      this.status = STATUS.UNSTART;
      const play = () => {
        this.togglePlay();
      };
      if (ua.isWeixin() && this.networkType !== 'wifi') {
        Dialog.confirm({
          message: '即将消耗手机流量，是否继续播放？',
          confirmButtonText: '播放',
        }).then(play);
      } else {
        play();
      }
    },

    firstLoadSource(src) {
      this.video.addSource(src);
      this.video.setStartTime(this.startAt);
      this.video.loadSource({ autoPlay: this.autoplay });
      // 禁止快进
      if (!this.canForward) {
        this.video.disablePlayForward(() => {
          Toast('该课程被限制快进，如有问题可联系客服');
        });
      }
      if (this.autoplay) {
        getNetworkType().then(() => {
          this.video.togglePlay();
        });
      }
      this.isFirstLoad = false;
      this.video.once('canplay', this.hideAndPlay);
    },

    togglePlay() {
      if (this.isFirstLoad) {
        this.firstLoadSource(this.src);
      } else {
        this.hideAndPlay();
      }
    },

    hideAndPlay() {
      this.delayHideControl();
      this.video.togglePlay();
    },

    toggleScreen() {
      this.delayHideControl();
      this.video.toggleFullscreen();
    },

    sliderChange(value) {
      this.video.setCurrentTime(Math.floor(this.time * value / 100));
      this.delayHideControl();
    },

    delayHideControl() {
      clearTimeout(timeout);
      this.showControl = true;
      timeout = setTimeout(() => {
        this.showControl = false;
      }, 5000);
    },

    toggleControl() {
      this.showControl = !this.showControl;
      this.showRate = false;
    },

    showRatePanel() {
      this.showControl = false;
      this.showRate = true;
    },

    isCurrentRate(rate) {
      return this.currentRate === `${rate}X` || (this.currentRate === '倍速' && rate === 1);
    },

    switchRate(rate) {
      this.currentRate = `${rate}X`;
      this.video.$video.playbackRate = rate;
      this.$emit('togglePlayRate', rate);
    },
  },
};
</script>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.vis-video {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: #000;

  &__element {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  &__bg-img {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    &::after {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .6);
      content: '';
    }
  }

  &__control {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &_bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      width: 100%;
      padding: 14px 0;
      background: linear-gradient(transparent, rgba(74, 74, 74, .35) 50%, rgba(0, 0, 0, .5));
      box-sizing: border-box;

      &_play {
        margin: 0 12px 0 16px;
      }

      &_time {
        font-size: 10px;
        line-height: 18px;
        flex-shrink: 0;
      }

      &_rate {
        display: block;
        width: 32px;
        margin: 0 8px;
        margin-left: 8px;
        font-size: 12px;
        line-height: 18px;
        color: #fff;
        text-align: center;
        flex-shrink: 0;
      }

      &_slider {
        width: 100%;
        padding: 8px 0;
        margin: 0 12px;

        &_btn {
          display: block;
          width: 14px;
          height: 14px;
          background-color: #00b389;
          border: 4px solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
        }
      }

      &_screen {
        margin-right: 12px;
        margin-left: 8px;
      }
    }

    &_rate {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      padding: 12px 12px 0;
      background: rgba(0, 0, 0, .6);
      box-sizing: border-box;

      &_item {
        display: block;
        width: 118px;
        margin-bottom: 8px;
        font-size: 12px;
        line-height: 32px;
        color: #ced0d2;
        text-align: center;
        background-color: rgba(255, 255, 255, .1);
        border-radius: 16px;

        &.current {
          background-color: #fff;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
}
</style>
