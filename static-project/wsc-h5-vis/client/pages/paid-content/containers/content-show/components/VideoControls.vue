<template>
  <div
    class="video-controls"
    @click="onCall('toggleControls')">
    <span
      v-show="showControls && !usePurePlayer"
      class="button-use-pure"
      @click.stop="onPurePlayerUsed">
      播放不流畅？
    </span>

    <div
      v-show="showControls"
      class="controls"
      @click.stop="onCall('resetControlsAutoHideTimer')">
      <svg-icon
        v-if="status === PCT_VIDEO_STATUS.PLAY"
        class="controls__btn-pause"
        symbol="video-btn-pause"
        @click.native="onEmit('pause')"
      />
      <svg-icon
        v-else
        class="controls__btn-play"
        symbol="video-play-solid"
        @click.native="onEmit('play')"
      />

      <div class="controls__current-time">
        {{ readableCurrentTime || '0:00' }}
      </div>

      <div class="controls__slider">
        <div
          v-for="range in buffered"
          :key="range.start"
          class="controls__slider--buffered"
          :style="{ left: `${range.startPercent || 0}%`, right: `${100 - (range.endPercent || 0)}%` }"
        />
        <van-slider
          v-model="progress"
          active-color="#00b389"
          inactive-color="#fff"
          @change="onEmit('update-progress', $event)"
          @input="onSliderInput"
        />
      </div>

      <div class="controls__duration">
        {{ readableDuration || '0:00' }}
      </div>

      <svg-icon
        v-if="showBtnGrow"
        class="controls__btn-grow"
        symbol="video-btn-grow"
        @click.native="onEmit('grow')"
      />
      <svg-icon
        v-else
        class="controls__btn-shrink"
        symbol="video-btn-shrink"
        @click.native="onEmit('shrink')"
      />
    </div>

    <!-- 下一篇提示 -->
    <div
      v-if="showNextTip"
      class="next-tip"
      :class="{ 'next-tip--bottom': !showControls }">
      即将播放：{{ nextVideoTitle }}
      <span class="next-tip__btn-cancel" @click.stop="onEmit('cancel-play-next')">
        取消
      </span>
    </div>

    <van-slider
      v-show="!showControls"
      v-model="progress"
      class="bottom-progress"
      active-color="#dcdee0"
      inactive-color="#fff"
    />
  </div>
</template>

<script>
import { Slider, Toast } from 'vant';
import SvgIcon from 'components/svg-icon';
import { PCT_VIDEO_STATUS } from 'pct/components/pct-video';
import * as SafeLink from '@youzan/safe-link';

function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}
function getReadableTime(seconds) {
  const minute = parseInt(seconds / 60, 10);
  const second = parseInt(seconds % 60);
  return `${minute}:${pad(second)}`;
}

const CONTROLS_AUTO_HIDE_TIMER = 5000;

export default {
  name: 'video-controls',

  components: {
    'van-slider': Slider,
    SvgIcon,
  },

  props: {
    status: Number,
    currentTime: Number,
    duration: Number,
    showNextTip: Boolean,
    nextVideoTitle: String,
    usePurePlayer: Boolean,
    showBtnGrow: Boolean,
    buffered: Array,
  },

  data() {
    return {
      PCT_VIDEO_STATUS,
      // 展示控件
      showControls: true,
      // 控件自动隐藏计时器
      controlsAutoHideTimer: 0,
      progress: 0,
      isSeeking: false,
    };
  },

  computed: {
    readableCurrentTime() {
      return getReadableTime(this.currentTime);
    },

    readableDuration() {
      return getReadableTime(this.duration);
    },
  },

  watch: {
    showControls: {
      immediate: true,
      handler(showControls) {
        if (showControls) {
          this.setControlsAutoHideTimer();
        } else {
          this.removeControlsAutoHideTimer();
        }
      },
    },

    currentTime(newCurrentTime) {
      if (this.isSeeking) return;

      this.progress = (newCurrentTime / this.duration) * 100 >> 0;
    },
  },

  mounted() {
    // 防止在拖动进度条时，进度条自动隐藏
    const pivot = document.querySelector('.controls__slider .van-slider__button');
    pivot.addEventListener('touchstart', () => {
      this.removeControlsAutoHideTimer();
    });
    pivot.addEventListener('touchend', () => {
      this.setControlsAutoHideTimer();
    });
    pivot.addEventListener('touchcancel', () => {
      this.setControlsAutoHideTimer();
    });
  },

  methods: {
    onCall(methodName, ...args) {
      this[methodName] && this[methodName](...args);
    },

    onEmit(...args) {
      this.isSeeking = false;
      this.$emit(...args);
    },

    getReadableTime,

    toggleControls() {
      this.showControls = !this.showControls;
    },

    resetControlsAutoHideTimer() {
      this.removeControlsAutoHideTimer();
      this.setControlsAutoHideTimer();
    },

    setControlsAutoHideTimer() {
      this.controlsAutoHideTimer = setTimeout(() => {
        this.showControls = false;
      }, CONTROLS_AUTO_HIDE_TIMER);
    },

    removeControlsAutoHideTimer() {
      clearTimeout(this.controlsAutoHideTimer);
    },

    onPurePlayerUsed() {
      this.$emit('play');
      Toast('感谢您的反馈，正在为您切换系统播放器');
      this.$emit('video-abnormal', { type: 'userfeedback', video: this.$refs.video });
      setTimeout(() => {
        const reUrl = location.href + '&purevideo=1';
        SafeLink.redirect({
          url: reUrl,
        });
        location.reload();
      }, 3000);
    },

    onSliderInput() {
      this.isSeeking = true;
    },
  },
};
</script>

<style lang="scss">
.video-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;

  .button-use-pure {
    position: absolute;
    top: 6px;
    right: 10px;
    padding: 5px;
    font-size: 12px;
    font-weight: 300;
    color: #999;
    text-decoration: underline;
    height: 16px;
  }

  .next-tip {
    position: absolute;
    right: 15px;
    bottom: 45px;
    padding: 0 15px 0 10px;
    height: 24px;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    background: rgba(50, 50, 50, .8);
    border-radius: 12px;

    &--bottom {
      bottom: 15px;
    }

    &__btn-cancel {
      margin-left: 10px;
      text-decoration: underline;
    }
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-top: 15px;
    width: 100%;
    height: 60px;
    background: linear-gradient(transparent, rgba(74, 74, 74, .35) 50%, rgba(0, 0, 0, .5));

    &__btn-play {
      margin: 0 13px 0 17px;
      width: 10px;
      height: 15px;
    }

    &__btn-pause {
      margin: 0 13px 0 15px;
      width: 12px;
      height: 16px;
    }

    &__current-time {
      margin-right: 16px;
      line-height: 14px;
      font-size: 10px;
      color: #fff;
    }

    &__slider {
      position: relative;
      flex: 1 1 auto;
      background-color: #f2f2f2;
      border-radius: 1px;

      .van-slider__button {
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        border: 4px solid #fff;
      }

      .van-slider {
        background: transparent;
      }

      &--buffered {
        position: absolute;
        height: 2px;
        background: #c8c9cc;
        border-radius: 1px;
      }
    }

    &__duration {
      margin-left: 16px;
      line-height: 14px;
      font-size: 10px;
      color: #fff;
    }

    &__btn-grow,
    &__btn-shrink {
      margin: 0 13px 0 9px;
      width: 18px;
      height: 18px;
    }
  }

  .bottom-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .van-slider__button {
      display: none;
    }

    .van-slider__bar {
      background-color: #00b389;
    }
  }
}
</style>
