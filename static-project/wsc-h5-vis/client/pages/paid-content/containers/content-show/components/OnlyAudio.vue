<template>
  <div class="audio-content">
    <div class="container">
      <img class="bg--blur" :src="contentData.cover">
      <div class="bg--gray" />

      <div class="container-cover">
        <top-recommends
          v-if="showRecommend"
          :single-module="recommendData"
          source="audio"
        />

        <div v-else class="cover">
          <img class="cover__img" :src="contentData.cover">
          <div v-if="!isOwned && !isTryMode" class="cover__mask">
            <img-wrap
              class="cover__mask-icon"
              :width="'20px'"
              :height="'23px'"
              src="https://img01.yzcdn.cn/pct/images/lock.svg"
              disable-lazyload
            />
          </div>

          <div v-show="coverTip" class="cover__tip">
            <span class="cover__tip-text">
              {{ coverTip }}
            </span>
            <span
              v-if="coverTipState === 'next'"
              class="cover__tip-button"
              @click="onAutoPlayCancel"
            >
              取消
            </span>
          </div>

          <div v-if="isAudioLoading" class="cover__mask">
            <van-loading class="cover__loading" />
          </div>
        </div>
      </div>

      <div class="container-controls">
        <audio-with-controls
          :src="audioUrl"
          :is-auto-play="isAutoPlayMode"
          :before-play="beforePlay"
          :latest-progress="progress"
          @show-tip="onTipShow"
          @play="onAudioPlay"
          @ended="onAudioEnded"
          @progress="onAudioProgress"
          @loading="onAudioLoading"
          @loaded="onAudioLoaded"
          @error="onAudioError"
        />
      </div>

      <div v-show="showStickTip" class="tip-foo">
        试试边听边聊微信？
      </div>

      <div v-if="showTopTip" class="tip-bar">
        <p class="tip-bar__desc">
          点击右上角，选<svg-icon class="tip-bar__desc-icon" symbol="double-circle" />可以边听边聊微信
        </p>
        <button class="tip-bar__button" @click="onTopTipForeverHide">
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Loading } from 'vant';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import UA from 'zan-utils/browser/ua_browser';
import { ZNB } from '@youzan/wxsdk';
import { ImgWrap } from '@youzan/vis-ui';
import SvgIcon from 'components/svg-icon';
import apis from 'pct/api';
import TopRecommends from './goods-recommends/TopRecommends';
import AudioWithControls from './AudioWithControls';

let currentNetwork = 'default';
function checkNetType(success, checkWxsdk = false) {
  let timer;
  if (checkWxsdk) {
    timer = setTimeout(() => {
      Toast('出错了：微信SDK初始化失败，请联系客服重新授权公众号');
    }, 1500);
  }

  ZNB.getWx().then(wx => {
    if (checkWxsdk) {
      clearTimeout(timer);
    }

    wx.getNetworkType({
      success(res) {
        currentNetwork = res.networkType;
        success && success(res);
      },
      fail(msg) {
        console.warn(JSON.stringify(msg));
      },
    });
  });
}

export default {
  name: 'only-audio',

  components: {
    SvgIcon,
    TopRecommends,
    AudioWithControls,
    ImgWrap,
    'van-loading': Loading,
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
  },

  data() {
    return {
      isWillFinish: false, // 小于 5s 视为即将结束状态
      showNextSize: true,
      // 播放状态：beforePlay, playing, afterPlay
      playStatus: 'beforePlay',
      isAudioLoading: false,
      isNextAutoPlay: true,
      showStickTip: false, // 置顶按钮提示
      showTopTip: false, // 顶部置顶提示
      isNetworkChecked: true,
      progressTimer: 0, // 节流计时器
      showRecommend: false, // 推荐

      contentGetText: '订阅',
      // 有下一篇内容
      isHasNext: false,
    };
  },

  computed: {
    // 免费试听音频
    isTryMode() {
      return !this.isOwned && this.contentData.preview;
    },

    // 音频源链接
    audioUrl() {
      return this.isOwned
        ? this.contentData.content
        : this.contentData.preview === 'preview' // 防盗判断
          ? ''
          : this.contentData.preview;
    },

    coverTip() {
      return this[`${this.coverTipState}CoverTip`];
    },

    coverTipState() {
      switch (this.playStatus) {
        case 'beforePlay':
          return 'start';
        case 'playing':
          return 'next';
        case 'afterPlay':
          return 'ended';
        default:
          return '';
      }
    },

    // 播放前封面提示
    startCoverTip() {
      if (this.isOwned) return '';

      if (this.isTryMode) {
        return `可以免费试听部分内容，${this.contentGetText}后可以收听完整音频`;
      }

      return this.contentData.sellerType === 2
        ? this.isFreeGoods
          ? '领取专栏后可免费收听'
          : '当前内容订阅专栏后才能收听'
        : this.isFreeGoods
          ? '领取后可免费收听'
          : '当前内容订阅后才能收听';
    },

    // 播放结束封面提示
    endedCoverTip() {
      if (this.isTryMode) {
        return this.contentData.sellerType === 2
          ? `试听结束，${this.contentGetText}专栏后可以收听完整内容`
          : `试听结束，${this.contentGetText}后可以收听完整内容`;
      }

      return '';
    },

    nextCoverTip() {
      let nextCoverTip = '';
      if (this.autoPlayNext && this.isWillFinish) {
        nextCoverTip = `即将播放：${this.contentData.nextOwlInfo.title}`;
        if (this.showNextSize && this.contentData.nextOwlInfo.materialSize) {
          nextCoverTip += `（${this.contentData.nextOwlInfo.materialSize}M流量）`;
        }
      }

      return nextCoverTip;
    },

    autoPlayNext() {
      return this.isOwned && this.isHasNext && this.isNextAutoPlay;
    },
  },

  watch: {
    contentData: {
      immediate: true,
      handler() {
        this.init();
      },
    },
  },

  methods: {
    init() {
      this.isWillFinish = false;
      this.showNextSize = true;
      this.playStatus = 'beforePlay';
      this.isNextAutoPlay = true;
      this.showStickTip = false;
      this.showTopTip = false;

      this.contentGetText = this.isFreeGoods ? '领取' : '购买';
      this.isHasNext = !!(
        this.contentData.nextOwlInfo.alias &&
        ([1, 2, 3].indexOf(this.contentData.nextOwlInfo.mediaType) !== -1)
      );
    },

    /**
     * 播放前检测网络状态
     */
    beforePlay(next) {
      if (!this.isNetworkChecked || !UA.isWeixin()) {
        return next();
      }
      // 每次播放时，如果是非 wifi 环境，提示用户
      // hotfix: 暂时屏蔽，会导致安卓微信 7.0.8 版本wifi环境下无法播放音频
      // checkNetType(({ networkType }) => {
      //   if (networkType !== 'wifi') {
      //     Dialog.confirm({
      //       message: '<p style="text-align: center">即将消耗手机流量，是否继续播放？</p>',
      //       confirmButtonText: '播放',
      //     }).then(() => {
      //       this.isNetworkChecked = false;
      //       next();
      //     }).catch(() => {
      //       this.$refs.audioController.pause();
      //     });
      //   } else {
      //     next();
      //   }
      // }, true);
      next();
    },

    /**
     * 上报音频错误
     */
    postError(error) {
      apis.postSkynetJson({
        log: {
          key: 'pct:audio:error',
          userId: _global.visBuyer && _global.visBuyer.buyerId,
          userPhone: _global.visBuyer && _global.visBuyer.buyerPhone,
          alias: this.contentData.alias,
          url: this.audioUrl,
          error: JSON.stringify({
            name: error.name,
            message: error.message,
            code: error.code,
            extraInfo: error.extraInfo && Object.assign(error.extraInfo, { networkType: currentNetwork }),
          }),
        },
      });
    },

    /**
     * 播放开始后的钩子
     */
    onAudioPlay() {
      this.playStatus = 'playing';

      // 隐藏推荐
      this.showRecommend = false;

      // 第一次点击播放时提示置顶
      const showStickTip = YZLocalStorage.getItem('paidcontent:showStickTip') !== 'no';
      if (showStickTip && UA.isWeixin() && UA.isIOS()) {
        this.showStickTip = true;
      }

      // 向上层报告播放，方便埋点
      this.$emit('play', 'audio');
    },

    onAudioEnded() {
      this.playStatus = 'afterPlay';
      this.$emit('after-play');

      // 推荐逻辑
      if (this.recommendData && this.recommendData.recommends) {
        this.showRecommend = true;
      }

      if (this.autoPlayNext) {
        this.$emit('play-next', this.contentData.nextOwlInfo.alias);
      }
    },

    /**
     * 更新进度
     */
    onAudioProgress(progress) {
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
      if (progress.current !== 0 && progress.total - progress.current <= 5) {
        if (!this.isWillFinish) {
          checkNetType(({ networkType }) => {
            this.showNextSize = networkType !== 'wifi';
          });
        }

        this.isWillFinish = true;
      } else {
        this.isWillFinish = false;
      }
    },

    onAudioLoading() {
      this.isAudioLoading = true;
    },

    onAudioLoaded() {
      this.isAudioLoading = false;
    },

    /**
     * 取消自动播放下一个
     */
    onAutoPlayCancel() {
      this.isNextAutoPlay = false;
    },

    onTopTipForeverHide() {
      this.showTopTip = false;
      YZLocalStorage.setItem('paidcontent:showStickTip', 'no');
    },

    onTipShow() {
      this.showStickTip = false;
      this.showTopTip = true;
    },

    onAudioError(error) {
      this.postError(error);
    },
  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.audio-content {
  .container {
    position: relative;
    display: flex;
    height: 290px;
    padding: 0 15px;
    overflow: hidden;
    user-select: none;
    flex-direction: column;

    &-cover {
      flex: 0 0 204px;
    }

    &-controls {
      position: relative;
      flex: 1 1 auto;
    }

    .bg--blur {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      filter: blur(15px);
      transform: translate(-50%, -50%);
      object-fit: cover;
    }

    .bg--gray {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(50, 50, 51, .6);
    }

    .cover {
      position: absolute;
      left: 50%;
      height: 194px;
      padding: 13px 15px;
      transform: translateX(-50%);
      box-sizing: border-box;

      &__img {
        height: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        object-fit: contain;
        object-position: center;
      }

      &__mask {
        position: absolute;
        top: 50%;
        left: 50%;
        width: calc(100% - 30px);
        height: calc(100% - 26px);
        background: rgba(0, 0, 0, .6);
        border-radius: 4px;
        transform: translate(-50%, -50%);

        &-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 23px;
          transform: translate(-50%, -50%);
        }
      }

      &__loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__tip {
        position: absolute;
        bottom: 19px;
        left: 50%;
        display: flex;
        max-width: 270px;
        padding: 7px 15px 6px;
        font-size: 12px;
        line-height: 17px;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        background: rgba(50, 50, 51, .8);
        border-radius: 15px;
        transform: translateX(-50%);

        &-button {
          margin-left: 15px;
          text-decoration: underline;
          flex: 0 0 auto;
        }

        &-text {
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1 1 auto;
        }
      }
    }

    .tip-foo {
      position: absolute;
      bottom: 56px;
      left: 13px;
      height: 30px;
      padding: 0 15px;
      font-size: 12px;
      line-height: 30px;
      color: $c-white;
      background: rgba(50, 50, 51, .8);
      border-radius: 15px;

      &::after {
        position: absolute;
        bottom: -12px;
        left: 15px;
        border-top: 6px solid rgba(50, 50, 51, .8);
        border-right: 5px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 5px solid transparent;
        content: '';
      }
    }

    .tip-bar {
      position: absolute;
      top: 20px;
      right: 15px;
      padding: 15px 20px;
      text-align: right;
      background: rgba(50, 50, 51, .9);
      border-radius: 4px;

      &::after {
        position: absolute;
        top: -12px;
        right: 25px;
        border-top: 6px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 6px solid rgba(50, 50, 51, .9);
        border-left: 5px solid transparent;
        content: '';
      }

      &__desc {
        font-size: 14px;
        line-height: 20px;
        color: #fff;
        white-space: nowrap;

        &-icon {
          width: 20px;
          height: 20px;
          margin: 0 11px;
          vertical-align: middle;
        }
      }

      &__button {
        display: inline-block;
        height: 24px;
        padding: 0 11px;
        margin-top: 12px;
        font-size: 12px;
        line-height: 24px;
        color: #fff;
        background: #00b389;
        border: none;
        border-radius: 12px;
      }
    }
  }
}

.slideup-enter-active,
.slideup-leave-active {
  transition: all .3s;
}

.slideup-enter,
.slideup-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
