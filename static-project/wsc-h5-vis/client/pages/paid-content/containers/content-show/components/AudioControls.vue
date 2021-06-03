<template>
  <div class="audio-controls">
    <!-- 进度条 -->
    <div class="progress">
      <div class="progress__current-time">
        {{ currentTime || '0:00' }}
      </div>
      <div class="progress__slider">
        <div
          v-for="range in buffered"
          :key="range.start"
          class="progress__slider--buffered"
          :style="{ left: `${range.startPercent || 0}%`, right: `${100 - (range.endPercent || 0)}%` }"
        />
        <van-slider
          v-model="value"
          active-color="#00b389"
          inactive-color="#fff"
          @change="onEventEmit('update-progress', $event)"
          @input="onSliderInput"
        />
      </div>
      <div class="progress__duration">
        {{ duration || '0:00' }}
      </div>
    </div>

    <!-- 控件 -->
    <div class="controls">
      <svg-icon
        class="controls__tip"
        symbol="stick"
        :style="{ visibility: showTipButton ? 'visible' : 'hidden' }"
        @click.native="onEventEmit('show-tip')"
      />
      <svg-icon
        class="controls__back"
        symbol="back15"
        @click.native="onEventEmit('back')"
      />
      <svg-icon
        v-if="isPlay"
        class="controls__pause"
        symbol="pause_audio"
        @click.native="onEventEmit('pause')"
      />
      <svg-icon
        v-else
        class="controls__play"
        symbol="play_audio"
        @click.native="onEventEmit('play')"
      />
      <svg-icon
        class="controls__forward"
        symbol="forward15"
        @click.native="onEventEmit('forward')"
      />
      <div class="controls__rate" @click="onRateChange">
        {{ RATE_OPTIONS[currentRateIndex] }}x
      </div>
    </div>
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';
import { slider } from 'vant';
import SvgIcon from 'components/svg-icon';

const RATE_OPTIONS = ['1.0', '1.25', '1.5', '2.0'];

export default {
  name: 'audio-controls',

  components: {
    'van-slider': slider,
    SvgIcon,
  },

  props: {
    currentTime: String,
    duration: String,
    progress: Number,
    isPlay: Boolean,
    disabled: Boolean,
    buffered: Array,
  },

  data() {
    return {
      value: 0,
      currentRateIndex: 0,
      showTipButton: UA.isIOS() && UA.isWeixin(),
      RATE_OPTIONS,
      isSeeking: false,
    };
  },

  watch: {
    progress: {
      immediate: true,
      handler(newProgress) {
        if (this.isSeeking) return;

        this.value = newProgress;
      },
    },
  },

  methods: {
    onEventEmit(eventName = '', ...args) {
      if (this.disabled) {
        this.$emit(`${eventName}-disabled`);
        return;
      }
      this.isSeeking = false;

      this.$emit(eventName, ...args);
    },

    onRateChange() {
      if (this.disabled) return;

      this.currentRateIndex += 1;
      if (this.currentRateIndex >= RATE_OPTIONS.length) this.currentRateIndex = 0;
      this.$emit('change-rate', +RATE_OPTIONS[this.currentRateIndex]);
    },

    onSliderInput() {
      this.isSeeking = true;
    },
  },
};
</script>

<style lang="scss">
.audio-controls {

  .progress {
    display: flex;
    align-items: center;
    height: 18px;

    &__current-time {
      margin-right: 18px;
      flex: 0 0 20px;
      line-height: 14px;
      font-size: 10px;
      color: #fff;
    }

    &__slider {
      position: relative;
      flex: 1 1 auto;
      align-self: center;
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
      margin-left: 18px;
      flex: 0 0 20px;
      line-height: 14px;
      text-align: right;
      font-size: 10px;
      color: #fff;
    }
  }

  .controls {
    display: flex;
    align-items: center;
    height: 57px;

    &__tip {
      margin: 0 43px 0 10px;
      flex: 0 0 16px;
      height: 16px;
    }

    &__back,
    &__forward {
      flex: 1 1 auto;
      height: 24px;
    }

    &__play,
    &__pause {
      flex: 1 1 auto;
      height: 42px;
    }

    &__rate {
      margin: 0 10px 0 18px;
      flex: 0 0 40px;
      box-sizing: border-box;
      width: 40px;
      height: 20px;
      line-height: 18px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 10px;
    }
  }
}
</style>
