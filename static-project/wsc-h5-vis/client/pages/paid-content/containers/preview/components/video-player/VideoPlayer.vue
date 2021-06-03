<template>
  <div
    class="cap-video-wrap cover-wrap"
    :class="{ 'cap-video-wrap--fullscreen': isFullscreen, 'cap-video-wrap--inline': isInline }"
    @touchstart="onProgressStart"
    @touchend="onProgressEnd">
    <div
      class="cap-video"
      :style="videoStyle"
      @touchend="toggleActionsDisplay">
      <div class="cap-video__content-wrap video-js vjs-fluid" style="height: 100%">
        <!-- pc video.js播放 -->
        <video
          v-if="isPC"
          ref="video"
          :style="contentStyle"
          :class="`cap-video__content ${ fixVideoStyle ? 'video-fix': '' }`"
          playsinline
          webkit-playsinline
          x5-playsinline
          :controls.prop="isAndroid"
          controlsList="nodownload">
          <!-- <source :src="src" type="application/x-mpegURL" />
          <source :src="src" type="video/mp4" /> -->
          <!-- <source :src="src" /> -->
          当前浏览器不支持最新的video播放
        </video>
        <!-- 播放器 -->
        <video
          v-else-if="!usePurePlayer"
          ref="video"
          :class="`cap-video__content ${ fixVideoStyle ? 'video-fix': '' }`"
          :src="src"
          :style="contentStyle"
          playsinline
          webkit-playsinline
          x5-playsinline
          :controls.prop="isAndroid"
          controlsList="nodownload">
          当前浏览器不支持最新的video播放
        </video>
        <video
          v-else
          ref="video"
          :class="`cap-video__content ${ fixVideoStyle ? 'video-fix': '' }`"
          :src="src"
          :style="contentStyle"
          controlsList="nodownload">
          当前浏览器不支持最新的video播放
        </video>
        <!-- 卡顿按钮 -->
        <span
          v-show="isShowVideoActions && !usePurePlayer"
          class="cap-video__hang-btn"
          @click.stop="onClickHang">
          播放不流畅？
        </span>
        <!-- 视频封面 -->
        <img
          v-show="isStop"
          class="cap-video__cover"
          :src="cover">
        <!-- 加载icon -->
        <van-loading v-show="isLoading" class="cap-video__loading" />
        <!-- 播放/暂停按钮 -->
        <transition name="fade">
          <div v-show="isShowVideoActions">
            <span
              v-if="isPlaying"
              class="cap-video__pause"
              @click.stop="pause"
            />
            <span
              v-else
              class="cap-video__play"
              @click.stop="play(progress.latest ? progress.latest.current : 0)"
            />
          </div>
        </transition>
      </div>
      <!-- 操作栏 -->
      <transition name="fade">
        <div v-show="isShowVideoActions" class="cap-video__action-bar">
          <span class="cap-video__current-time">
            {{ currentTime }}
          </span>
          <!-- 进度滑块 -->
          <van-slider
            color="#f44"
            loaded-color="#fff"
            :value="percentage"
            :loaded-start-value="loadedStartPercentage"
            :loaded-value="loadedPercentage"
            :orientation="isFullscreen ? 'Y' : 'X'"
            @valueUpdate="updateProgress"
          />
          <span class="cap-video__duration-time">
            {{ duration }}
          </span>
          <!-- 全屏按钮 -->
          <span class="cap-video__fullscreen-btn" @click.stop="toggleFullscreen" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { Loading, Toast } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import UALib from 'zan-utils/browser/ua';
import Slider from 'components/slider';
import { videoControllerMixin } from '../video-controller';
import { ZNB } from '@youzan/wxsdk';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'cap-video',

  components: {
    'van-loading': Loading,
    'van-slider': Slider,
  },

  mixins: [videoControllerMixin],

  props: {
    src: String,
    cover: String,
    isInline: Boolean,
    autoPlay: Boolean,
    setVideoEl: Function,
    height: {
      type: Number,
      default: 210,
    },
    isStop: Boolean,
    progress: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    // ua_browser 库的 isMobile 方法认为包含 micromessenger 的都属于移动平台
    // 但是 windows/mac 系统的微信内置浏览器都包含 micromessenger
    // 经过测试，windows/mac 系统的微信内置浏览器 ua 都包含 windowswechat
    // ios/android 不包含
    // 所以暂时可以通过 windowswechat 来区分是否是 windows/mac 系统的微信内置浏览器
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isPC = !UA.isMobile() || userAgent.indexOf('windowswechat') > -1;

    return {
      isPC,
      orientation: 'portrait',
      fixVideoStyle: false,
      isAndroid: UA.isAndroid(),
      // 切换video，使用纯原生组件，让系统接管播放
      usePurePlayer: false,
    };
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
      const width = this.isStop && UA.isAndroid() ? 0 : '100%';
      const visibility = this.isStop ? 'hidden' : 'visible';
      return {
        visibility,
        width,
        // height: `${this.height}px`
      };
    },
  },

  watch: {
    src(newV) {
      if (newV && this.autoPlay) {
        const play = () => {
          let current = 0;
          if (this.progress && this.progress.latest) {
            const latestProgress = this.progress.latest;
            current = latestProgress.current;
          }
          this.play(current);
        };

        if (UA.isWeixin()) {
          ZNB.getWx().then(wx => {
            wx.getNetworkType({
              success: (res) => {
                play();
              },
              fail(msg) {
                console.warn(JSON.stringify(msg));
              },
            });
          });
        } else {
          // 这是因为在播放时调用 video.play 可能会报错
          this.$nextTick(() => {
            play();
          });
        }
      }
    },
  },

  created() {
    // fix chrome video downlaod control button
    const isChrome = UALib.isChrome();
    const chromeVersion = parseInt(UALib.getChromeVersion());

    if (isChrome && (chromeVersion <= 57 && chromeVersion >= 55)) {
      this.fixVideoStyle = true;
    }

    // 通过url特殊表示来确定是否采用纯video标签
    if (location.href.indexOf('purevideo') >= 0) {
      this.usePurePlayer = true;
    }
  },

  mounted() {
    this.orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';

    window.addEventListener('resize', () => {
      const orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
      // 在 Android 微信浏览器中，视频大小的切换也会触发 resize 事件，并且也还有其他可能触发 resize 事件的 case
      // 所以只在竖屏切换到横屏并且已经开始播放时，使视频进入全屏模式
      if (orientation === this.orientation || this.isStop) return;
      this.orientation = orientation;

      const video = this.$refs.video;
      if (!video) return;
      if (orientation === 'landscape') {
        if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      }
    });

    // 自动播放
    if (this.autoPlay) {
      ZNB.getWx().then(wx => {
        wx.getNetworkType({
          success: (res) => {
            this.play();
          },
          fail(msg) {
            console.warn(JSON.stringify(msg));
          },
        });
      });
    }

    // 如果自动播放，退出全屏模式
    // this.$refs.video.addEventListener('ended', () => {
    //   if (this.autoPlay) this.$refs.video.webkitExitFullscreen();
    // });

    if (this.isPC) {
      // pc 需要监听 click 事件来唤起视频控件
      document.querySelector('.cap-video-wrap.cover-wrap')
        .addEventListener('click', this.toggleActionsDisplay);

      // 使用video.js播放器
      this.useVideoJs();
    } else {
      this.setVideoEl(this.$refs.video);
    }
  },

  beforeDestroy() {
    if (!this.player) {
      // 销毁video.js播放器实例
      this.videojsPlayer.dispose();
    }
  },

  methods: {
    exitFullscreen() {
      this.$refs.video.webkitExitFullscreen();
    },
    toggleFullscreen() {
      const video = this.$refs.video;
      // ios 触发全屏时让平台接管视频的控制
      if (video && video.readyState > 0 && !this.isFullscreen) {
        this.$refs.video.webkitEnterFullscreen();
        this.$emit('enter-fullscreen');
      }
    },
    getVideoHeight() {
      return Math.floor(this.$refs.video.getBoundingClientRect().height);
    },

    onClickHang() {
      this.play();
      Toast('感谢您的反馈，正在为您切换系统播放器');
      this.$emit('video-abnormal', { type: 'userfeedback', video: this.$refs.video });
      setTimeout(() => {
        const reUrl = location.href + '&purevideo=1';
        SafeLink.redirect({
          url: reUrl,
          kdtId: window._global.kdt_id,
        });
        location.reload();
      }, 3000);
    },

    // 使用video.js播放器
    useVideoJs() {
      Toast.loading({
        duration: 10000,
      });
      import('video.js/dist/video-js.css');
      import('video.js')
        .then(videojs => {
          videojs = videojs.default;
          if (!this.src) {
            this.setVideoEl(this.$refs.video);
            return Toast.clear();
          }
          this.videojsPlayer = videojs(this.$refs.video, {
            sources: [{ src: this.src }],
          }, () => {
            this.setVideoEl(this.$refs.video);
            Toast.clear();
          });
        })
        .catch(error => {
          console.error(error);
          Toast.clear();
          Toast('播放器加载失败');
        });
    },
  },
};
</script>

<style lang="scss">
@import 'var';

/** 修复 chrome video 自带下载控件的问题 **/
video.video-fix::-internal-media-controls-download-button {
  display: hidden !important;
}
video.video-fix::-webkit-media-controls-enclosure {
  overflow: hidden !important;
}
video.video-fix::-webkit-media-controls-panel {
  width: calc(100% + 30px) !important;
}

.cap-video-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
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
    text-align: center;
  }

  &__content {
    object-fit: contain;
    width: 100%;
  }

  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
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
    width: 55px;
    height: 55px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAMAAADxhdbJAAAAulBMVEUAAAAAAAAAAAAAAAAAAAAAAACBgYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v5iYmIrKysaGhoQEBAAAAAAAAAAAADs7OzHx8f6+vr09PTw8PC0tLSZmZl0dHRERET39/fj4+Pb29vX19fR0dG9vb2hoaH7+/vo6Ojm5uavr6+FhYVUVFRQUFD///9wIZ9UAAAAPXRSTlNmAF9dYWOSTkwSBVgbAkgOLAk7HTUMOQtTPiUkRRT8hHFsakIxGeS/9+/psZ6MefHb0s7Ht6P539ytlH99tx4IiAAABA5JREFUaN7Nmuda2zAUhiVZjkfsONOGLEaStkAppUC37/+2KiDmBNdJ9EnO+P4wnthvzpKPpcM4okGv3W15J03huqJ54rW67d6AI9LGhVHfc1mFXK8fxfXisjmhKpH+PKsLFw59piF/GNaAC04l05Q8DSxxwbjKdVIoySr3jgML3KRV4jiOI1YorlD/KFFbE0Nc2C2h5BoflpDd0AQ3dFZZgm2UWCU6Qxg38Mr3qlb1N/IGGK4nCCaYpsTKRT0AF6eVMAiYxrq4jkdZwEBRPnkdPVzSLK7AYOWLmokObiIK0wQzkpDFL5PtuEhuMA00UEbbcJFLl9jz3GgzbiKL5YlZqVjq5GQTLhEUNjtJueQm63GdJn22Ll6zsw4Xe8tPuqwGuUueF6/BpYBtgH1pNa5H36oOkZd6VbiBWAaX1abijoMKnA/UG1h//v+4IUCDecMyLnSApITT0wlLuC4SODx83fe4CeZK3J3BO1zr1fS6WXTT1iouwI3DzSPcGA0cHr4Z4RK2exxL3nCnOA3nnRa4UO4DJ8MlbgjQLHjDJc4H0tIiOf1XXIcBRXdhXnose8G19Y27+DB9uDA2b/6C8/VDd5vn+fWtafD8Z1zs6ruykStNHy/N3OnGCheRuVo4pR9/zbwZKVwfx+Xfn4xwfYXzyLu6OKX7c4PgeQonmZJkIC6/+w3QlgCXswHREZzSxwvUPAWjTEFx+fUZGrwea8M40vQGwylY18CZpK9fEGcqGHUpAI706TPUsTCPkQAc6RtQEh47ITaEI101dM1TsCaVHYqjkrjUKzwFc2rA5R/O9HCi+GGHy6dPWqkpLXGkcy2cnTNJd5c6znTsUoWC90cvVWwKgfR4qVkIFmVOhXerXebGixjp4RxYxPAlGl80aYk2fQDRIwF7AEU2uOkvsBUzah5o7YKbBy7hVKGVGexr5VvjJ2HcVQNtxJiHt7X0VDVraxcYjtIfxy0ULi6CB+B+UvojoYvBF64G9XsmL1zo62QD62bLRY6+LJ+hvfq7W3fgrYCb+4btVgAf7WejY7TnbZz9blIdaguOz3aPmx1u+5SPsX12fK99zFdxwX63vnm64439wx5b8NEuD2VGhz5y4tnuDtSywx8Xct4HeACtv+WoV9R81HscB9mcJ049/iRPOsmmIYRA1DuEIIJjGrHgfCGKS1zjJCloIto+HhM4dY3HOAE4/ONamMaayTGONql679sPbvXjYx1LU8p8m6E7P4NHCkercds+Urj64ZHRwGRqNjCZ4gOT1bOnrqBxUPq7PH9qM+w6q3y0SCFkZRc1CyxHeRNklDepY1B51NKBtUZhXWPYnbYvN9rltzv1DpnHi7kvq1HzBTBkjiiL2unzCL0jpfM8Qp+2o4wj+gfblKJxDtrlbwAAAABJRU5ErkJggg==);
    background-size: 55px 55px;
    transform: translate(-50%, -50%);
  }

  &__pause {
    background-image: url(data:image/png;base64,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);
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

  &__hang-btn {
    position: absolute;
    top: 6px;
    right: 10px;
    padding: 5px;
    font-size: 12px;
    font-weight: 300;
    color: #999;
    text-decoration: underline;
    height: 16px;
    display: none;
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
