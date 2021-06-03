<template>
  <div class="video-content">
    <div
      class="video-content__video-wrapper"
      :class="[{'hide-action-bar': showPlayBtn}, {'video-content-fix': isInline}]"
      :style="{ height: `${coverHeight}px` }">
      <!-- 由于安卓环境下播放按钮显示兼容性问题，因此设置一个统一的第一次播放的按钮 -->
      <span
        v-show="showPlayBtn"
        class="video-content__play-btn"
        @click="onPlayClick"
      />

      <!-- 播放前封面提示 -->
      <!-- <p
        v-if="coverTipState === 'start' && this.startCoverTipType"
        :class="['video-content__cover-tip', `video-content__cover-tip--${startCoverTipType}`]">
        {{ startCoverTip }}
      </p> -->

      <video-controller
        ref="videoController"
        :auto-play="autoPlay">
        <template>
          <video-player
            ref="videoPlayer"
            :height="coverHeight"
            :auto-play="autoPlay"
            :src="videoUrl"
            :is-inline="isInline"
          />
        </template>
      </video-controller>
    </div>
  </div>
</template>

<script>
import UALib from 'zan-utils/browser/ua';
import VideoController from '../../../../../components/video-controller';
import VideoPlayer from '../../../../../components/video-player';

export default {
  name: 'question-video',

  components: {
    VideoController,
    VideoPlayer,
  },

  props: {
    autoPlay: Boolean,
    videoUrl: String,
  },

  data() {
    const isPC = window.innerWidth > 600 && !UALib.isMobile();

    return {
      coverHeight: isPC ? 200 : (window.innerWidth - 40) * 9 / 16, // 封面高度
      showPlayBtn: true,
      isInline: true,
    };
  },

  // computed: {
  //   /* 复合状态 */

  //   hasNext() {
  //     return !!(this.contentData.nextOwlInfo.alias &&
  //       (this.contentData.nextOwlInfo.mediaType === 2 || this.contentData.nextOwlInfo.mediaType === 3)
  //     );
  //   },

  //   hasTry() {
  //     return !!this.contentData.videoPreviewUrl;
  //   },

  //   // 试用模式
  //   inTryMode() {
  //     return !this.isPaid && this.hasTry;
  //   },

  //   autoPlayNext() {
  //     return this.isPaid && this.hasNext && this.shouldAutoPlayNext;
  //   },

  //   // 根据状态自动判断是否展示封面提示
  //   showCoverTip() {
  //     return (this.coverTipState === 'start' && this.startCoverTipType) ||
  //       (this.coverTipState === 'next' && this.autoPlayNext && this.willFinish) ||
  //       (this.coverTipState === 'ended' && this.endedCoverTipType);
  //   },

  //   coverTipState() {
  //     switch (this.playStatus) {
  //       case 'beforePlay':
  //         return 'start';
  //       case 'playing':
  //         return 'next';
  //       case 'afterPlay':
  //         return 'ended';
  //       default:
  //         return '';
  //     }
  //   },

  //   startCoverTipType() {
  //     if (this.isPaid) return '';
  //     if (this.inTryMode) return 'try';

  //     return 'notallowed';
  //   },

  //   endedCoverTipType() {
  //     if (this.inTryMode) return 'try';
  //     if (this.hasNext && this.networkType !== 'wifi') return 'next';

  //     return '';
  //   },

  //   /* 动态信息 */

  //   // 播放前显示的封面提示
  //   startCoverTip() {
  //     switch (this.startCoverTipType) {
  //       case 'try':
  //         return '可以免费试看部分内容，购买后可以观看完整视频';
  //       case 'notallowed':
  //         return this.contentData.sellerType === 2
  //           ? '此视频为付费内容，订购专栏即可查看'
  //           : '此视频为付费内容，购买后即可播放';
  //       default:
  //         return '';
  //     }
  //   },

  //   // 播放结束显示的封面提示
  //   endedCoverTip() {
  //     if (this.endedCoverTipType === 'try') {
  //       return this.contentData.sellerType === 2
  //         ? '试听已结束，购买专栏查看更多内容'
  //         : '试听已结束，购买后继续收听';
  //     }

  //     return '';
  //   },

  //   videoUrl() {
  //     return this.isPaid ? this.contentData.videoUrl : this.contentData.videoPreviewUrl;
  //   },

  //   cover() {
  //     return this.contentData.cover || '';
  //   },

  //   countPlayUrl() {
  //     if (this.isPaid) {
  //       return this.contentData.videoCountPlayedUrl;
  //     } else {
  //       return this.contentData.videoPreviewUrl ? this.contentData.videoPreviewCountPlayedUrl : this.contentData.videoCountPlayedUrl;
  //     }
  //   }
  // },

  // watch: {
  //   contentData() {
  //     console.log('重置视频内容状态');
  //     this.resetState();
  //   }
  // },

  created() {
  },

  mounted() {
    this.videoController = this.$refs.videoController;
    this.videoPlayer = this.$refs.videoPlayer;
  },

  methods: {
    onPlayClick() {
      this.play();
    },
    onVideoPlay() {
      // 隐藏播放按钮
      this.showPlayBtn = false;
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

  &__content-info {
    margin-top: 56.25%;
  }

  &__cover-tip {
    box-sizing: border-box;
    z-index: 1001;
    width: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, .7);

    &--try {
      position: absolute;
      bottom: 0;
      z-index: 1001;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
    }

    &--notallowed {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-sizing: border-box;
      font-size: 16px;
      text-align: center;

      &:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }

    &--next {
      position: absolute;
      bottom: 0;
      padding: 0 15px;
      line-height: 40px;
      font-size: 14px;
      background-color: rgba(0, 0, 0, .7);

      button {
        box-sizing: border-box;
        float: right;
        margin-top: 8px;
        padding: 0 12px;
        height: 24px;
        line-height: 22px;
        color: #fff;
        font-size: 12px;
        border: 1px solid #fff;
        border-radius: 2px;
        background: transparent;
      }
    }

    &--ended-try {
      position: relative;
      z-index: 1001;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;

      .ended-try {
        &__replay-btn {
          margin: 20px auto 0;
          display: block;
          width: 30px;
          height: 30px;
        }

        &__text--big {
          line-height: 22px;
          color: #fff;
          font-size: 16px;
        }

        &__text--small {
          margin-top: 4px;
          line-height: 14px;
          color: #fff;
          font-size: 10px;
        }
      }
    }

    &--ended-next {
      position: relative;
      z-index: 1001;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;

      .ended-next {
        &__text--small {
          line-height: 14px;
          color: #fff;
          font-size: 10px;
        }

        &__title {
          margin-top: 4px;
          max-width: calc(100vw - 30px);
          line-height: 26px;
          color: #fff;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &__btn {
          display: inline-block;
          box-sizing: border-box;
          margin-top: 16px;
          padding: 0 14px;
          height: 24px;
          line-height: 22px;
          color: #fff;
          font-size: 12px;
          border: 1px solid #fff;
          border-radius: 2px;

          &-icon {
            display: inline-block;
            margin-right: 2px;
            width: 8px;
            height: 10px;
          }
        }
      }
    }
  }

  &__video-wrapper {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 211px;
    overflow: hidden;

    &.video-content-fix {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }

    /* 播放结束或第一次播放时不显示视频操作按钮 */
    &.hide-action-bar {
      .cap-video__action-bar {
        display: none;
      }

      .cap-video__play {
        display: none;
      }
    }
  }

  &__play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAMAAADxhdbJAAAAulBMVEUAAAAAAAAAAAAAAAAAAAAAAACBgYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v5iYmIrKysaGhoQEBAAAAAAAAAAAADs7OzHx8f6+vr09PTw8PC0tLSZmZl0dHRERET39/fj4+Pb29vX19fR0dG9vb2hoaH7+/vo6Ojm5uavr6+FhYVUVFRQUFD///9wIZ9UAAAAPXRSTlNmAF9dYWOSTkwSBVgbAkgOLAk7HTUMOQtTPiUkRRT8hHFsakIxGeS/9+/psZ6MefHb0s7Ht6P539ytlH99tx4IiAAABA5JREFUaN7Nmuda2zAUhiVZjkfsONOGLEaStkAppUC37/+2KiDmBNdJ9EnO+P4wnthvzpKPpcM4okGv3W15J03huqJ54rW67d6AI9LGhVHfc1mFXK8fxfXisjmhKpH+PKsLFw59piF/GNaAC04l05Q8DSxxwbjKdVIoySr3jgML3KRV4jiOI1YorlD/KFFbE0Nc2C2h5BoflpDd0AQ3dFZZgm2UWCU6Qxg38Mr3qlb1N/IGGK4nCCaYpsTKRT0AF6eVMAiYxrq4jkdZwEBRPnkdPVzSLK7AYOWLmokObiIK0wQzkpDFL5PtuEhuMA00UEbbcJFLl9jz3GgzbiKL5YlZqVjq5GQTLhEUNjtJueQm63GdJn22Ll6zsw4Xe8tPuqwGuUueF6/BpYBtgH1pNa5H36oOkZd6VbiBWAaX1abijoMKnA/UG1h//v+4IUCDecMyLnSApITT0wlLuC4SODx83fe4CeZK3J3BO1zr1fS6WXTT1iouwI3DzSPcGA0cHr4Z4RK2exxL3nCnOA3nnRa4UO4DJ8MlbgjQLHjDJc4H0tIiOf1XXIcBRXdhXnose8G19Y27+DB9uDA2b/6C8/VDd5vn+fWtafD8Z1zs6ruykStNHy/N3OnGCheRuVo4pR9/zbwZKVwfx+Xfn4xwfYXzyLu6OKX7c4PgeQonmZJkIC6/+w3QlgCXswHREZzSxwvUPAWjTEFx+fUZGrwea8M40vQGwylY18CZpK9fEGcqGHUpAI706TPUsTCPkQAc6RtQEh47ITaEI101dM1TsCaVHYqjkrjUKzwFc2rA5R/O9HCi+GGHy6dPWqkpLXGkcy2cnTNJd5c6znTsUoWC90cvVWwKgfR4qVkIFmVOhXerXebGixjp4RxYxPAlGl80aYk2fQDRIwF7AEU2uOkvsBUzah5o7YKbBy7hVKGVGexr5VvjJ2HcVQNtxJiHt7X0VDVraxcYjtIfxy0ULi6CB+B+UvojoYvBF64G9XsmL1zo62QD62bLRY6+LJ+hvfq7W3fgrYCb+4btVgAf7WejY7TnbZz9blIdaguOz3aPmx1u+5SPsX12fK99zFdxwX63vnm64439wx5b8NEuD2VGhz5y4tnuDtSywx8Xct4HeACtv+WoV9R81HscB9mcJ049/iRPOsmmIYRA1DuEIIJjGrHgfCGKS1zjJCloIto+HhM4dY3HOAE4/ONamMaayTGONql679sPbvXjYx1LU8p8m6E7P4NHCkercds+Urj64ZHRwGRqNjCZ4gOT1bOnrqBxUPq7PH9qM+w6q3y0SCFkZRc1CyxHeRNklDepY1B51NKBtUZhXWPYnbYvN9rltzv1DpnHi7kvq1HzBTBkjiiL2unzCL0jpfM8Qp+2o4wj+gfblKJxDtrlbwAAAABJRU5ErkJggg==);
    background-size: 60px 60px;
    transform: translate(-50%, -50%);
    z-index: 1001;
  }

  &__cover-wrap {
    position: absolute;
    bottom: 0;
    z-index: 1001;
  }

  &__tips {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-weight: 300;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    padding-left: 15px;
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

    .cap-video__cover {
      height: 100%;
    }
  }

  .cap-video__action-bar {
    bottom: 0;
  }
}
</style>
