<template>
  <div
    class="video-cover"
    :class="{ 'video-cover--overlay': showCoverOverlay }"
    :style="videoCoverStyle"
  >
    <!-- 流量状态下连续播放提示 -->
    <div v-if="showNextTip" class="video-cover__next-tip">
      <p>接下来播放</p>
      <p class="video-cover__next-tip__title">
        {{ nextTitle }}
      </p>
    </div>
    <!-- hotfix: 解决流量播放按钮问题 -->
    <div
      v-if="showNextTip"
      class="video-cover__btn-flow"
      @click="onPlayNext"
    >
      <svg-icon
        class="video-cover__btn-flow__icon"
        symbol="video-play-solid"
      />
      流量播放
      <span v-if="nextSize" class="video-cover__btn-flow__data">
        {{ videoSize }}M
      </span>
    </div>

    <!-- 播放按钮 -->
    <svg-icon
      v-if="showBtnPlay"
      class="video-cover__play-btn"
      symbol="video-play"
      @click.native="onPlay"
    />
    <!-- 流量播放按钮 -->
    <div
      v-else-if="showBtnFlow"
      class="video-cover__btn-flow"
      @click="onPlay"
    >
      <svg-icon
        class="video-cover__btn-flow__icon"
        symbol="video-play-solid"
      />
      流量播放
      <span class="video-cover__btn-flow__data">
        {{ videoSize }}M
      </span>
    </div>
    <!-- 锁图标 -->
    <img-wrap
      v-else-if="showIconLock"
      class="video-cover__icon-lock"
      :width="'20px'"
      :height="'23px'"
      src="https://img01.yzcdn.cn/pct/images/lock.svg"
      disable-lazyload
    />

    <!-- 重播按钮 -->
    <svg-icon
      v-if="showBtnReplay"
      class="video-cover__btn--replay"
      symbol="video-replay"
      @click.native="onPlay"
    />

    <!-- 封面提示 -->
    <div v-if="coverTip && !isLoading" class="video-cover__tip">
      <span>{{ coverTip }}</span>
    </div>

    <!-- 推荐商品 -->
    <top-recommends
      v-if="showRecommend"
      class="video-cover__recommends"
      :single-module="recommendData"
    />

    <!-- 右下角重播按钮 -->
    <div
      v-if="showRecommend || showNextTip"
      class="video-cover__replay"
      @click="onPlay"
    >
      <svg-icon class="video-cover__replay__btn" symbol="video-replay" />
      重播
    </div>
  </div>
</template>

<script>
import TopRecommends from './goods-recommends/TopRecommends';
import SvgIcon from 'components/svg-icon';
import { ImgWrap } from '@youzan/vis-ui';

const isShopExpired =
  ['close', 'pause', 'protect'].indexOf(window._global.lifecycleStatus) > -1;

export default {
  name: 'video-cover',

  components: {
    TopRecommends,
    SvgIcon,
    ImgWrap,
  },

  props: {
    isOwned: Boolean,
    isInTry: Boolean,
    contentGetText: String,
    playStatus: String,
    contentData: Object,
    recommendData: Object,
    isHasTry: Boolean,
    networkType: String,
    isLoading: Boolean,
    nextTitle: String,
    nextSize: [Number, String],
  },

  computed: {
    isFreeGoods() {
      return +this.contentData.sellerType === 2
        ? +this.contentData.columnDetail.price === 0
        : +this.contentData.price === 0;
    },

    videoSize() {
      return this.playStatus === 'afterPlay'
        ? this.nextSize
        : this.contentData.materialSize;
    },

    // 封面背景
    videoCoverStyle() {
      const background = `url(${this.contentData.cover || ''}) center / cover`;
      // if (this.showCoverOverlay) background += ',rgba(0, 0, 0, .6)';

      return { background };
    },

    // 展示封面遮罩
    showCoverOverlay() {
      if (
        this.playStatus === 'beforePlay' &&
        this.showBtnPlay &&
        !this.coverTip
      ) {
        return false;
      }
      return true;
    },

    // 封面提示
    coverTip() {
      switch (this.playStatus) {
        case 'beforePlay':
          return this.startCoverTip;
        case 'afterPlay':
          return this.endedCoverTip;
        default:
          return '';
      }
    },

    // 播放前显示的封面提示
    startCoverTip() {
      if (this.isOwned) {
        // 如果已打烊，则不能播放
        if (isShopExpired) return '店铺已到期，无法播放视频\n请联系商家';
        return '';
      }

      if (this.isInTry) {
        return `可免费试看部分内容，${this.contentGetText}后可以观看完整视频`;
      }

      return this.contentData.sellerType === 2
        ? this.isFreeGoods
          ? '领取后可免费观看'
          : '当前内容购买专栏后才能观看'
        : this.isFreeGoods
          ? '领取后可免费观看'
          : '当前内容购买后才能观看';
    },

    // 播放结束显示的封面提示
    endedCoverTip() {
      if (this.isInTry) {
        return this.contentData.sellerType === 2
          ? `试播已结束，${this.contentGetText}专栏查看更多内容`
          : `试播已结束，${this.contentGetText}后继续播放`;
      }

      return '';
    },

    // 展示顶部推荐商品
    showRecommend() {
      return this.playStatus === 'afterPlay' &&
        this.recommendData &&
        this.recommendData.recommends;
    },

    // 展示重播按钮
    showBtnReplay() {
      return this.playStatus === 'afterPlay' && !this.showRecommend && !this.showNextTip;
    },

    // 展示带有流量提示的播放按钮
    showBtnFlow() {
      return this.playStatus === 'beforePlay' &&
        this.isOwned &&
        this.networkType !== 'wifi' &&
        this.contentData.materialSize &&
        !isShopExpired;
    },

    // 展示连续播放提示
    showNextTip() {
      return this.playStatus === 'afterPlay' &&
        !this.showRecommend &&
        this.isOwned &&
        this.networkType !== 'wifi' &&
        this.nextTitle;
    },

    showIconLock() {
      return (this.playStatus === 'beforePlay' &&
        !this.isOwned &&
        !this.isHasTry) ||
        (this.playStatus === 'beforePlay' &&
        (this.isOwned || (this.isHasTry &&
        isShopExpired)));
    },

    // 展示播放按钮
    showBtnPlay() {
      return this.playStatus === 'beforePlay' &&
        (this.isOwned || this.isHasTry) &&
        !this.isLoading &&
        !(this.networkType !== 'wifi' && this.contentData.materialSize) &&
        !isShopExpired;
    },

    // 展示加载动画
    showLoading() {
      return false;
    },
  },

  methods: {
    onPlay() {
      this.$emit('play');
    },

    onPlayNext() {
      this.$emit('play-next');
    },
  },
};
</script>

<style lang="scss">
.video-cover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &--overlay::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: rgba(0, 0, 0, .6);
    content: '';
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1001;
    transform: translate(-50%, -50%);
  }

  &__play-btn {
    width: 50px;
    height: 50px;
    flex: 0 0 auto;
  }

  &__tip {
    margin-top: 20px;
    font-size: 12px;
    line-height: 16px;
    color: #fff;
    text-align: center;
    flex: 0 0 auto;

    & > span {
      white-space: pre;
    }
  }

  &__btn-flow {
    height: 40px;
    padding: 11px 15px;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    text-indent: 5px;
    background: rgba(0, 0, 0, .6);
    border-radius: 20px;
    box-sizing: border-box;

    &__icon {
      width: 8px;
      height: 12px;
      margin: 0 5px;
      vertical-align: middle;
    }

    &__data {
      color: #00b389;
    }
  }

  &__icon-lock {
    width: 20px;
    height: 23px;
  }

  &__btn--replay {
    width: 23px;
    height: 23px;
  }

  &__recommends {
    padding: 0 75px 0 30px;
  }

  &__replay {
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 12px;
    line-height: 16px;
    color: #fff;

    &__btn {
      width: 14px;
      height: 16px;
      margin-right: 3px;
      vertical-align: -3px;
    }
  }

  &__next-tip {
    font-size: 12px;
    line-height: 17px;
    color: #fff;
    text-align: center;

    &__title {
      max-width: 270px;
      margin: 5px 0 10px;
      overflow: hidden;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
