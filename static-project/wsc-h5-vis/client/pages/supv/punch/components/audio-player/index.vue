<template>
  <div class="audio-player">
    <!-- 左边主按钮 -->
    <div class="audio-player__control">
      <div
        v-if="paused"
        class="audio-player__btn--play"
        @click="play"
      />
      <div
        v-else
        class="audio-player__btn--pause"
        @click="pause"
      />
    </div>

    <!-- 右侧信息展示区 -->
    <div class="audio-player__main">
      <div class="audio-player__title">
        {{ title }}
      </div>

      <div class="audio-player__slider-container">
        <van-slider
          v-model="currentTime"
          class="audio-player__slider"
          :min="0"
          :max="duration"
          active-color="#00b389"
          inactive-color="#f2f2f2"
          @change="seek"
        >
          <span slot="button" class="audio-player__slider-button" />
        </van-slider>
      </div>

      <div class="audio-player__timestamp">
        <span class="audio-player__current-time">
          {{ formattedCurrentTime }}
        </span>
        <span class="audio-player__duration">
          {{ formattedDuration }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Slider } from 'vant';
import mixinBaseAudio from 'supv/punch/mixins/mixin-base-audio';

export default {
  name: 'audio-player',

  components: {
    'van-slider': Slider,
  },

  mixins: [mixinBaseAudio],

  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.audio-player {
  display: flex;
  box-sizing: border-box;
  height: 80px;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  background: #fff;

  &__control {
    flex: 0 0 auto;
    width: 80px;
    height: 100%;
  }

  &__btn {

    @mixin btn ($url) {
      margin: 18px auto 0;
      width: 40px;
      height: 40px;
      background: url($url) no-repeat;
      background-size: contain;
    }

    &--play {
      @include btn("data:image/png;base64,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");
    }

    &--pause {
      @include btn("data:image/png;base64,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");
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 16px 10px 16px 5px;
    overflow: hidden;
  }

  &__title {
    flex: 0 0 auto;
    height: 13px;
    overflow: hidden;
    line-height: 13px;
    text-align: left;
    font-size: 13px;
    color: #333;

    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__slider-container {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  &__slider {
    width: 100%;
    padding: 0 0 0 1px;
    margin: 0;
    box-sizing: border-box;
  }

  &__slider-button {
    display: block;
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    background-color: #fff;
    border: 2px solid #00b389;
    border-radius: 50%;
  }

  &__timestamp {
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    height: 10px;
    line-height: 10px;
    font-size: 10px;
    font-weight: 700;
    color: #333;
  }
}
</style>
