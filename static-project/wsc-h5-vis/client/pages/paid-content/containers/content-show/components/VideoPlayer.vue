<template>
  <div class="video-player">
    <!-- 播放器 -->
    <video
      v-if="!isPurePlayer"
      ref="video"
      :class="`${ isFixVideoStyle ? 'video-fix': '' }`"
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
      :class="`${ isFixVideoStyle ? 'video-fix': '' }`"
      :src="src"
      :style="contentStyle"
      controlsList="nodownload">
      当前浏览器不支持最新的video播放
    </video>

    <slot
      v-if="video.videoEl"
      :video="video"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import UALib from 'zan-utils/browser/ua';
// import enableInlineVideo from 'iphone-inline-video';
import PctVideo from 'pct/components/pct-video';

export default {
  name: 'video-player',

  props: {
    src: {
      type: String,
      default: '',
    },
    playRate: {
      type: Number,
      default: 1.0,
    },
    // 是否可以快进和倍速播放
    canForward: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    // ua_browser 库的 isMobile 方法认为包含 micromessenger 的都属于移动平台
    // 但是 windows/mac 系统的微信内置浏览器都包含 micromessenger
    // 经过测试，windows/mac 系统的微信内置浏览器 ua 都包含 windowswechat
    // ios/android 不包含
    // 所以暂时可以通过 windowswechat 来区分是否是 windows/mac 系统的微信内置浏览器
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isPC = !UA.isMobile() || userAgent.indexOf('windowswechat') > 0;
    const isIPad = UA.isIPad();

    return {
      isPC,
      isIPad,
      isAndroid: UA.isAndroid(),
      orientation: 'portrait',
      video: {},
      videoEl: null,
      videojsPlayer: null,
      // 修复 chrome 指定版本下自动展示下载按钮的问题
      isFixVideoStyle: false,
      // 切换video，使用纯原生组件，让系统接管播放
      isPurePlayer: false,
    };
  },

  computed: {
    contentStyle() {
      const width = this.video.ended && UA.isAndroid() ? 0 : '100%';
      const visibility = this.video.ended ? 'hidden' : 'visible';
      return {
        visibility,
        width,
        height: '100%',
      };
    },
  },

  watch: {
    playRate(newV) {
      this.video.rate = newV;
    },

    src(newV) {
      if (this.videojsPlayer) {
        this.videojsPlayer.src(newV);
      }
    },
  },

  created() {
    // fix chrome video downlaod control button
    const isChrome = UALib.isChrome();
    const chromeVersion = parseInt(UALib.getChromeVersion());

    if (isChrome && (chromeVersion <= 57 && chromeVersion >= 55)) {
      // 修复 chrome 指定版本下自动展示下载按钮的问题
      this.isFixVideoStyle = true;
    }

    // 通过url特殊表示来确定是否采用纯video标签
    if (location.href.indexOf('purevideo') >= 0) {
      this.isPurePlayer = true;
    }
  },

  mounted() {
    const videoEl = this.$refs.video;
    this.videoEl = videoEl;

    // 创建 video 实例
    const pctVideo = new PctVideo();
    // 注册监听事件
    const listeners = this.$listeners;
    Object.keys(listeners).forEach((event) => {
      pctVideo.on(event, listeners[event]);
    });
    // 设置能否快进和调整播放速度
    pctVideo.canForward = this.canForward;
    pctVideo.canSetRate = this.canForward;
    this.video = pctVideo;

    // 不能加这段逻辑啊，在 app 的 webview 里内联会出问题
    // 特殊逻辑，如果url有这个标识，不做任何处理
    // if (location.href.indexOf('purevideo') < 0) {
    // enableInlineVideo(videoEl);
    // }

    // 设置 resize 事件句柄
    this.setResizeHandler();

    let isHLS = false;
    if (this.src && this.src.indexOf('.m3u8') > -1 && this.isPC && !this.isIPad) {
      this.useHlsJs(pctVideo, this.src, videoEl);
      isHLS = true;
    }

    pctVideo.setVideoEl(videoEl, isHLS);
  },

  beforeDestroy() {
    if (this.videojsPlayer) {
      // 销毁video.js播放器实例
      this.videojsPlayer.dispose();
    }
  },

  methods: {
    getVideo() {
      return this.video;
    },

    setResizeHandler(videoEl) {
      this.orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
      window.addEventListener('resize', () => {
        const orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
        // 在 Android 微信浏览器中，视频大小的切换也会触发 resize 事件，并且也还有其他可能触发 resize 事件的 case
        // 所以只在竖屏切换到横屏并且已经开始播放时，使视频进入全屏模式
        if (orientation === this.orientation || this.video.ended) return;
        this.orientation = orientation;

        if (orientation === 'landscape' && videoEl) {
          if (videoEl.webkitEnterFullscreen) {
            videoEl.webkitEnterFullscreen();
          } else if (videoEl.webkitRequestFullscreen) {
            videoEl.webkitRequestFullscreen();
          } else if (videoEl.requestFullscreen) {
            videoEl.requestFullscreen();
          }
        }
      });
    },

    useHlsJs(pctVideo, src, video) {
      Toast.loading({
        duration: 10000,
      });
      import('hls.js')
        .then(Hls => {
          if (typeof Hls === 'object' && Hls.default && typeof Hls.default === 'function') {
            Hls = Hls.default;
          }

          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.log('error', event, data);
            });
          } else {
            Toast('出错了，不支持播放当前格式的视频');
          }
        })
        .catch(error => {
          Toast('出错了，视频加载失败');
          console.error(error);
        })
        .finally(_ => {
          Toast.clear();
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

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1000 !important;

  &.video-js {
    height: 100% !important;
  }

  &__content {
    object-fit: contain;
    width: 100%;
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
