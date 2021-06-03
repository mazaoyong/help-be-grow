<template>
  <div class="audio-player-container">
    <div class="audio-player__progress-wrap">
      <van-slider
        :value="percentage"
        :inactive="isStop"
        @valueUpdate="updateProgress">
        <template slot="pivot" slot-scope="props">
          <pivot
            :inactive="props.inactive"
            :progress="props.progress"
            :current-time="formatedCurrentTime"
            :duration="duration"
          />
        </template>
      </van-slider>
    </div>
    <div class="audio-player__action-wrap">
      <span class="audio-player__action-btn audio-player__back" @click="back">
        <svg-icon symbol="back15_preview" />
      </span>
      <span
        v-if="!isPlaying"
        class="audio-player__action-btn audio-player__play"
        @click="play">
        <svg-icon symbol="play_audio_preview" class="" />
      </span>
      <span
        v-else
        class="audio-player__action-btn audio-player__pause"
        @click="pause">
        <svg-icon symbol="pause_audio_preview" />
      </span>
      <span class="audio-player__action-btn audio-player__forward" @click="forward">
        <svg-icon symbol="forward15_preview" />
      </span>
      <span class="audio-player__action-btn audio-player__replay" @click="replay">
        <svg-icon symbol="replay" />
      </span>
      <span
        v-if="stickBtnVisible"
        class="audio-player__action-btn audio-player__stick"
        @click="$emit('showTopTip')">
        <svg-icon symbol="stick" />
      </span>
    </div>
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';
import SvgIcon from 'components/svg-icon';
import Slider from '../slider';
import { audioControllerMixin } from '../audio-controller';
import Pivot from './Pivot';

export default {
  name: 'audio-player',

  components: {
    'van-slider': Slider,
    SvgIcon,
    Pivot,
  },

  mixins: [audioControllerMixin],

  data() {
    return {
      stickBtnVisible: UA.isIOS() && UA.isWeixin(),
    };
  },

  mounted() {
    this.$emit('inited');
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

$c-player-timer: #999;
$c-player-background: #fff;

.audio-player-container {
  position: relative;
  background-color: $c-player-background;

  &::after {
    @include border-retina(bottom);
  }
}

.audio-player__progress-wrap {
  position: relative;
  z-index: 1;
}

.audio-player__current-time {
  position: absolute;
  top: 8px;
  left: 0;
  line-height: 28px;
  font-size: 20px;
  color: $c-player-timer;
  transform: translateX(-50%) scale(.5);
  transform-origin: top;
}

.audio-player__duration-time {
  position: absolute;
  line-height: 28px;
  top: 8px;
  right: 6px;
  color: $c-player-timer;
  font-size: 20px;
  transform: scale(.5);
  transform-origin: top right;
}

.audio-player__action-wrap {
  position: relative;
  padding: 22px 0 16px;
  text-align: center;
  font-size: 0;
}

.audio-player__action-btn {
  display: inline-block;
}

.svg-icon-back15_preview,
.svg-icon-forward15_preview {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.audio-player__play,
.audio-player__pause {
  margin: 0 40px;
}

.svg-icon-play_audio_preview,
.svg-icon-pause_audio_preview {
  width: 42px;
  height: 42px;
  vertical-align: middle;
}

.audio-player__replay {
  position: absolute;
  top: 35px;
  left: 15px;
}

.svg-icon-replay {
  width: 14px;
  height: 16px;
}

.audio-player__stick {
  position: absolute;
  top: 35px;
  right: 15px;
}

.svg-icon-stick {
  width: 16px;
  height: 16px;
}

@media only screen and (max-width: 320px) {

  .svg-icon-play_audio,
  .svg-icon-pause_audio {
    margin: 0 30px;
  }
}
</style>
