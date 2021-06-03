<template>
  <div
    class="video-content"
    :style="{ height: coverHeight, top: showTopBar ? '36px' : '0' }"
  >
    <div
      class="video-content__video-wrapper"
      :class="[{'video-content--fixed': isInline}]"
      :style="{ width: videoWidth, height: coverHeight, top: showTopBar ? '36px' : '0' }"
    >
      <video-player
        ref="videoPlayer"
        :src="videoUrl"
        :play-rate="videoPlayRate"
        :can-forward="contentData.speedSwitch !== 0"
        @play="onVideoPlay"
        @ended="onVideoEnded"
        @canplay="onVideoCanplay"
        @waiting="onVideoWaiting"
        @abnormal="onVideoAbnormal"
        @progress="onVideoProgress"
        @buffered-update="onVideoBufferedUpdate"
        @playing="onVideoPlaying"
      >
        <video-controls
          v-if="showControls && !isAndroid"
          slot-scope="props"
          :status="props.video.status"
          :current-time="props.video.currentTime"
          :duration="props.video.duration"
          :show-next-tip="showNextTip"
          :next-video-title="contentData.nextOwlInfo.title || ''"
          :show-btn-grow="isWindowsWechat ? !isFullscreenMock : true"
          :buffered="videoBuffered"
          @play="props.video.play"
          @pause="props.video.pause"
          @grow="onVideoGrow(props.video.grow)"
          @shrink="onVideoShrink(props.video.shrink)"
          @update-progress="props.video.updateProgress"
          @cancel-play-next="onPlayNextCancel"
          @video-abnormal="onVideoAbnormal"
        />
      </video-player>

      <video-cover
        v-if="showCover"
        :is-owned="isOwned"
        :is-in-try="isInTry"
        :is-free-goods="isFreeGoods"
        :content-get-text="contentGetText"
        :play-status="playStatus"
        :is-loading="playStatus !== 'afterPlay' && isLoading"
        :content-data="contentData"
        :recommend-data="recommendData"
        :network-type="networkType"
        :is-has-try="isHasTry"
        :next-title="contentData.nextOwlInfo.title || ''"
        :next-size="contentData.nextOwlInfo.materialSize || ''"
        @play="onPlay"
        @play-next="onPlayNext"
      />
    </div>

    <!-- 加载图标 -->
    <van-loading
      v-if="playStatus !== 'afterPlay' && isLoading"
      class="video-cover__loading"
      color="white"
    />

    <!-- 播放下一个弹窗 -->
    <van-dialog
      v-model="showNextDialog"
      class="video-content__next-dialog"
      show-cancel-button
      confirm-button-text="继续播放"
      cancel-button-text="暂停播放"
      @confirm="onPlayNext"
      @cancel="onNextDialogHide">
      <p class="next-dialog__text--big">
        接下来播放
      </p>
      <p class="next-dialog__text--big">
        {{ contentData.nextOwlInfo.title }}
      </p>
      <p v-if="contentData.nextOwlInfo.materialSize && networkType !== 'wifi'" class="next-dialog__text--small">
        {{ contentData.nextOwlInfo.materialSize }}M流量
      </p>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Loading } from 'vant';
import { ZNB } from '@youzan/wxsdk';
import UA from 'zan-utils/browser/ua_browser';
import VideoPlayer from './VideoPlayer';
import VideoCover from './VideoCover';
import VideoControls from './VideoControls';
import commonApis from 'pct/api';
import { setValidTimer as countVideoPlayed } from 'common/utils/count-played';

const _global = window._global;
const offlineData = _global.offlineData || {};

function getNetworkType() {
  return new Promise((resolve, reject) => {
    if (UA.isWeixin()) {
      ZNB.getWx().then(wx => {
        wx.getNetworkType({
          success(res) {
            resolve(res.networkType);
          },
          fail(msg) {
            reject();
            console.warn(JSON.stringify(msg));
          },
        });
      });
    } else {
      reject();
    }
  });
}

export default {
  name: 'only-video',

  components: {
    'van-loading': Loading,
    VideoPlayer,
    VideoCover,
    VideoControls,
  },

  props: {
    contentData: {
      type: Object,
      default() { return {}; },
    },
    isOwned: Boolean,
    isAutoPlayMode: Boolean,
    progress: {
      type: Object,
      default() {
        return {};
      },
    },
    recommendData: Object,
    isFreeGoods: Boolean,
    videoPlayRate: {
      type: Number,
      default: 1.0,
    },
  },

  data() {
    const isAndroid = UA.isAndroid();
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isWindowsWechat = userAgent.indexOf('windowswechat') > -1;

    return {
      isAndroid,
      isWindowsWechat,

      // 播放状态：beforePlay, playing, afterPlay
      playStatus: 'beforePlay',
      // 用户是否确定在流量环境下播放
      isNetworkChecked: false,
      videoProgress: 0,

      // 模拟全屏
      isFullscreenMock: false,
      isInline: true,
      showPlayBtn: true,
      networkType: 'wifi',
      showNextDialog: false, // 连续播放弹窗
      progressTimer: 0, // 节流计时器

      // 展示封面
      showCover: true,
      // 展示控件
      showControls: true,
      // 当前时间
      currentTime: '0:00',
      // 视频时长
      duration: '0:00',
      // 展示放大按钮
      showBtnGrow: true,
      // 播放进度
      playProgress: 50,
      // 加载中
      isLoading: false,

      // 有下一篇内容
      isHasNext: false,
      // 有试看内容
      isHasTry: false,
      // 试看
      isInTry: false,
      // 视频源地址
      videoUrl: '',
      // 播放次数统计地址
      countPlayUrl: '',
      // 购买还是领取文案
      contentGetText: '购买',

      // 是否在最后5秒检查过是否展示下一篇提示
      isPlayNextChecked: false,
      // 展示下一篇提示
      showNextTip: false,

      // 视频资源缓存range list
      videoBuffered: [],
      // 根据是否展示切换条动态控制视频位置
      showTopBar: offlineData.show,
    };
  },

  computed: {
    isMobile() {
      return UA.isMobile() && !this.$root.showPCMode;
    },
    videoWidth() {
      return this.isMobile || this.isFullscreenMock ? '100%' : '375px';
    },
    // 封面高度
    coverHeight() {
      if (this.isFullscreenMock) {
        return '100%';
      }
      return `${this.isMobile ? window.innerWidth * 0.5625 : 375 * 0.5625}px`;
    },
  },

  watch: {
    contentData: {
      immediate: true,
      handler() {
        this.init();
      },
    },

    videoUrl: {
      immediate: true,
      handler(newV) {
        if (newV && this.isAutoPlayMode) {
          const play = () => {
            this.onPlay();
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
  },

  created() {
    // TODO: autoPlay 自动播放

    // 获取网络状态
    getNetworkType()
      .then(res => {
        this.networkType = res;
      })
      .catch(() => {
        this.networkType = 'wifi';
      });
  },

  methods: {
    init() {
      this.playStatus = 'beforePlay';
      this.isNetworkChecked = false;
      this.isInline = true;
      this.showPlayBtn = true;
      this.showNextTip = false;
      this.isPlayNextChecked = false;

      this.isHasNext = !!(
        this.contentData.nextOwlInfo.alias &&
        ([1, 2, 3].indexOf(this.contentData.nextOwlInfo.mediaType) !== -1)
      );
      // 增加防盗导致不能试看还是本身没有试看视频逻辑
      this.isHasTry = !!this.contentData.videoPreviewUrl || !!this.contentData.videoPreviewId;
      // 试用模式
      this.isInTry = !this.isOwned && this.isHasTry;
      // 视频源地址
      this.videoUrl = this.isOwned ? this.contentData.videoUrl : this.contentData.videoPreviewUrl;

      if (this.isOwned) {
        this.countPlayUrl = this.contentData.videoCountPlayedUrl;
      } else {
        this.countPlayUrl = this.contentData.videoPreviewUrl
          ? this.contentData.videoPreviewCountPlayedUrl
          : this.contentData.videoCountPlayedUrl;
      }

      this.contentGetText = this.isFreeGoods ? '领取' : '购买';
    },

    shouldShowNextTip() {
      if (this.isPlayNextChecked) return;
      this.isPlayNextChecked = true;

      if (!UA.isWeixin()) {
        this.showNextTip = this.isOwned && this.isHasNext;
      } else {
        getNetworkType()
          .then(networkType => {
            this.networkType = networkType;
            this.showNextTip = this.isOwned &&
              this.isHasNext &&
              networkType === 'wifi';
          });
      }
    },

    /**
     * 播放前守卫，目前用来检测网络状态
     */
    beforePlay(playFn) {
      if (this.isNetworkChecked || !UA.isWeixin()) {
        playFn && playFn();
        return;
      }

      if (this.networkType !== 'wifi') {
        Dialog.confirm({
          message: `<div style="text-align: center">
            <p>即将消耗手机流量，是否继续播放？</p>
            <p>${this.contentData.materialSize || ''}</p>
          </div>`,
          confirmButtonText: '播放',
        }).then(() => {
          this.isNetworkChecked = true;
          playFn && playFn();
        }).catch(() => {
          // this.videoController.pause();
        });
      } else {
        playFn && playFn();
      }
    },

    onPlay() {
      const play = () => {
        // 恢复进度
        let current = 0;
        if (this.progress && this.progress.latest) {
          const latestProgress = this.progress.latest;
          current = latestProgress.current;

          // 进度小于 1 s，从头播放
          if (latestProgress.total - current < 1) current = 0;
        }

        const video = this.$refs.videoPlayer.getVideo();
        video.play(current, this.isAutoPlayMode);

        // 统计播放次数
        countVideoPlayed({
          videoId: this.isOwned ? this.contentData.videoId : this.contentData.videoPreviewId,
          channel: this.isOwned ? 'owl_content_main' : 'owl_content_preview',
          component: 'edu_video_player',
        });
      };

      if (this.isAutoPlayMode) {
        play();
      } else {
        this.beforePlay(play);
      }

      // 引发play事件，方便埋点
      this.$emit('play');
    },

    onVideoPlay() {
      // 置播放状态，隐藏封面的提示
      this.playStatus = 'playing';
      commonApis.postSkynetJson({
        log: {
          key: 'pct-video-play',
          user: window._global.buyer && window._global.buyer.account,
          alias: this.contentData.alias,
          videoId: this.contentData.videoId,
          network: this.networkType,
        },
      });
    },

    onVideoPlaying() {
      // 隐藏封面
      this.showCover = false;
    },

    onVideoEnded() {
      this.playStatus = 'afterPlay';
      this.showCover = true;

      this.$emit('after-play');

      // 自动播放下一个视频
      if (this.isOwned &&
        this.isHasNext &&
        this.isPlayNextChecked &&
        this.networkType === 'wifi' &&
        this.showNextTip
      ) {
        this.showNextTip = false;
        const video = this.$refs.videoPlayer && this.$refs.videoPlayer.getVideo();
        if (!video) {
          return;
        }
        video.shrink();
        if (this.isAndroid) {
          this.showNextDialog = true;
        } else {
          this.onPlayNext();
        }
      } else {
        this.showPlayBtn = true;
      }
    },

    onVideoProgress(progress) {
      this.videoProgress = progress;
      if (!this.isProgressLock || progress.force) {
        delete progress.force;
        this.$emit('log-progress', progress);
        clearTimeout(this.progressTimer);
        this.isProgressLock = true;
        this.progressTimer = setTimeout(() => {
          this.isProgressLock = false;
        }, 1000);
      }

      // 小于 5s 时，视为即将结束
      if (progress.total - progress.current <= 5) {
        this.shouldShowNextTip();
      } else {
        this.showNextTip = false;
      }
    },

    onVideoCanplay() {
      this.isLoading = false;
    },

    onVideoWaiting() {
      this.isLoading = true;
    },

    onVideoGrow(originGrow) {
      if (!this.isWindowsWechat) {
        originGrow();
      } else {
        this.isFullscreenMock = true;
      }
    },

    onVideoShrink(originShrink) {
      if (!this.isWindowsWechat) {
        originShrink();
      } else {
        this.isFullscreenMock = false;
      }
    },

    /**
     * 视频播放异常情况上报
     */
    onVideoAbnormal(data) {
      const { video = {}, info = {} } = data;
      const newInfo = Object.assign({}, info, {
        buffered: video.buffered,
        networkState: video.networkState,
        readyState: video.readyState,
        currentTime: video.currentTime,
        progress: this.videoProgress,
      });

      Object.assign(data, {
        video: undefined,
        info: newInfo,
      });

      commonApis.postSkynetJson({
        log: {
          key: 'pct-video-abnomal',
          user: window._global.buyer && window._global.buyer.account,
          alias: this.contentData.alias,
          videoId: this.contentData.videoId,
          videoType: data.type,
          network: this.networkType,
          currentTime: data.info.currentTime,
          progress: data.info.progress,
        },
        extra: {
          videoStatus: data,
          contentInfo: this.contentData,
          shopInfo: window._global && window._global.mp_data,
          userInfo: window._global && window._global.buyer,
          uaInfo: navigator.userAgent,
          network: this.networkType,
        },
      });
    },

    onVideoBufferedUpdate(buffered) {
      this.videoBuffered = buffered;
    },

    onNextDialogHide() {
      this.showNextDialog = false;
    },

    onPlayNextCancel() {
      this.showNextTip = false;
    },

    onPlayNext() {
      if (!this.isHasNext) return;

      this.$emit('play-next', this.contentData.nextOwlInfo.alias);
    },
  },
};
</script>

<style lang="scss">
.slideup-enter-active,
.slideup-leave-active {
  transition: all .3s;
}

.slideup-enter,
.slideup-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.video-content {
  position: relative;
  user-select: none;

  .video-content--fixed {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    z-index: 1000;
    width: 100%;
  }

  &__next-dialog {
    text-align: center;

    .van-dialog__content {
      padding: 10px 0 15px;
    }

    .next-dialog {

      &__text--big {
        margin-top: 5px;
        line-height: 22px;
        font-size: 16px;
      }

      &__text--small {
        margin-top: 5px;
        line-height: 18px;
        color: #999;
        font-size: 12px;
      }
    }
  }
}

.cap-video {
  height: 210px;

  .cap-video__content-wrap {
    height: 100%;

    .cap-video__content {
      height: 100%;
    }
  }
}
</style>
