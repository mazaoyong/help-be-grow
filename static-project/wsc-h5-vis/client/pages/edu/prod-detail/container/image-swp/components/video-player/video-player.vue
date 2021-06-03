<template>
  <div
    :class="{ 'cap-video-wrap--fullscreen': isFullscreen, 'cap-video-wrap--inline': isInline }"
    @click="toggleActionsDisplay"
    @touchstart="onProgressStart"
    @touchend="onProgressEnd"
    class="cap-video-wrap cover-wrap"
  >
    <div
      :style="videoStyle"
      class="cap-video"
    >
      <div class="cap-video__content-wrap">
        <!-- 播放器 -->
        <video
          ref="video"
          :src="src"
          :style="contentStyle"
          class="cap-video__content"
          playsinline
          webkit-playsinline
          x5-playsinline
        >当前浏览器不支持最新的video播放</video>
        <!-- 视频封面 -->
        <img-wrap
          v-show="isStop"
          :src="cover"
          :fullfill="'!750x0.jpg'"
          class="cap-video__cover"
          disable-lazyload
        />
        <!-- 加载icon -->
        <van-loading
          v-show="isLoading"
          class="cap-video__loading"
        />
        <!-- 播放/暂停按钮 -->
        <transition name="fade">
          <div v-show="isShowVideoActions">
            <span
              v-if="isPlaying"
              @click.stop="pause"
              class="cap-video__pause"
            />
            <span
              v-else
              @click.stop="play"
              class="cap-video__play"
            />
          </div>
        </transition>
      </div>
      <!-- 操作栏 -->
      <transition name="fade">
        <div
          v-show="isShowVideoActions"
          class="cap-video__action-bar"
        >
          <span class="cap-video__current-time">{{ currentTime }}</span>
          <!-- 进度滑块 -->
          <van-slider
            :value="percentage"
            :loadedStartValue="loadedStartPercentage"
            :loadedValue="loadedPercentage"
            :orientation="isFullscreen ? 'Y' : 'X'"
            @valueUpdate="updateProgress"
            color="#f44"
            loaded-color="#fff"
          />
          <span class="cap-video__duration-time">{{ duration }}</span>
          <!-- 全屏按钮 -->
          <span
            @click.stop="toggleFullscreen"
            class="cap-video__fullscreen-btn"
          />
        </div>
      </transition>
    </div>
    <!-- 关闭按钮 -->
    <transition name="fade">
      <span
        v-show="isShowVideoActions && !isInline"
        @click.stop="closeVideo"
        class="cap-video__close"
      />
    </transition>
  </div>
</template>

<script>
import { Loading } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import { ImgWrap } from '@youzan/vis-ui';
import Slider from '../slider';
import { videoControllerMixin } from '../video-controller';

export default {
  name: 'cap-video-player',

  components: {
    'van-loading': Loading,
    'van-slider': Slider,
    'img-wrap': ImgWrap,
  },

  mixins: [videoControllerMixin],

  props: {
    src: String,
    cover: String,
    isInline: Boolean,
  },

  computed: {
    isShowVideoActions() {
      if (UA.isAndroid()) return false;
      return this.isShowActions;
    },
    videoStyle() {
      if (!this.isFullscreen) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        height: width + 'px',
        width: height + 'px',
        transform: `translate(-50%, -50%) rotate(90deg)`,
      };
    },
    contentStyle() {
      const visibility = this.isStop ? 'hidden' : 'visible';
      return {
        visibility,
      };
    },
  },

  methods: {
    closeVideo() {
      this.$emit('close-video');
    },
    toggleFullscreen() {
      this.$emit('toggle-fullscreen');
    },
    getVideoHeight() {
      return Math.floor(this.$refs.video.getBoundingClientRect().height);
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

.cap-video-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $background-color;
  z-index: 1000 !important;

  &--inline {
    position: absolute;
  }

  &--fullscreen {
    .cap-video__action-bar {
      bottom: 0;
    }

    .cap-video__fullscreen-btn {
      background-size: 14px 14px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMA7yUV620gjXufl4dhNxEQrnpFGi+n4gAAAGpJREFUKM/lkkkOgCAQBFtkc0Wd///VgHQgRM+aWKdO1W0yIKPh2h0arGhOkbWJSroS+1ejvzgjjktsfhgluykzyhr34rihlpsmv+AlM9BsNAbu+XweWPvIUkeVVPjim9w8dUDDNHMZz3UCDvUIm45q5l0AAAAASUVORK5CYII=);
      background-position: center center;
    }

    .cap-video__close {
      left: auto;
      right: 20px;
    }
  }
}

.cap-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);

  &__content-wrap {
    position: relative;
  }

  &__content {
    width: 100%;
  }

  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
  }

  &__loading.van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__pause,
  &__play {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 103px;
    height: 44px;
    background-image: url('https://img01.yzcdn.cn/public_files/a3d95760462585b1e0c786a69d2e3571.png');
    background-repeat: no-repeat;
    transform: translate(-50%, -50%);
  }

  &__pause {
    background-image: url('https://img01.yzcdn.cn/public_files/894d1544f9a0d72b78a633ba20603a2d.png');
  }

  &__close {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 34px;
    height: 34px;
    transform: rotate(45deg);

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background-color: $c-white;
    }

    &::before {
      width: 24px;
      height: 2px;
    }

    &::after {
      width: 2px;
      height: 24px;
    }
  }

  &__action-bar {
    position: absolute;
    left: 0;
    right: 0;
    padding: 17px 80px 25px 52px;
  }

  &__current-time {
    position: absolute;
    top: 13px;
    left: 16px;
    font-size: 12px;
    color: $c-white;
  }

  &__duration-time {
    position: absolute;
    top: 13px;
    right: 45px;
    font-size: 12px;
    color: $c-white;
  }

  &__fullscreen-btn {
    position: absolute;
    top: 6px;
    right: 10px;
    padding: 5px;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 16px 16px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMA9xyJGG02n26e9kyurgAAAFRJREFUKM9jmCgoKCjBAAaBQKY4g9SqVasWQwSsgMyFDFJJSkoOEAEWJSU1oIACAxJgopKAA7IAy0KGYAYUYMEwnACa50zRvU+TQMaMSszILkRLDgCi4B3IQhTSDQAAAABJRU5ErkJggg==);
  }

  .van-slider__bar {
    height: 2px;
    background-color: rgba(255, 255, 255, .4);
  }

  .van-slider__pivot {
    margin-left: -15px !important;
    width: 30px;
    height: 30px;
    border: 0;
    background-color: transparent !important;
    box-shadow: none;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: $c-white;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 隐藏系统原生播放按钮 */

.IIV::-webkit-media-controls-play-button,
.IIV::-webkit-media-controls-start-playback-button {
  opacity: 0;
  pointer-events: none;
  width: 5px;
}
</style>
