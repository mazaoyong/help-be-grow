<template>
  <div class="video-content">
    <div
      class="video-content__video-wrapper"
      :class="[{'hide-action-bar': showPlayBtn}, {'video-content-fix': isInline}]"
      :style="{ height: `${coverHeight}px` }"
    >
      <!-- 由于安卓环境下播放按钮显示兼容性问题，因此设置一个统一的第一次播放的按钮 -->
      <span
        v-show="showPlayBtn"
        class="video-content__play-btn"
        @click="play"
      />

      <video-controller
        ref="videoController"
        @video-play="onVideoPlay"
        @video-end="onVideoEnd"
      >
        <template slot-scope="props">
          <video-player
            ref="videoPlayer"
            :video-event-bus="props.videoEventBus"
            :set-video-el="props.setVideoEl"
            :percentage="props.percentage"
            :loaded-percentage="props.loadedPercentage"
            :loaded-start-percentage="props.loadedStartPercentage"
            :current-time="props.currentTime"
            :duration="props.duration"
            :is-show-actions="props.isShowActions"
            :is-fullscreen="props.isFullscreen"
            :is-playing="props.isPlaying"
            :is-stop="props.isStop"
            :is-pause="props.isPause"
            :is-loading="props.isLoading"
            :src="contentData.videoUrl"
            :cover="cover || ''"
            :is-inline="isInline"
          />
        </template>
      </video-controller>
    </div>

    <slot name="content-info" />
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';
// import ContentInfo from './ContentInfo';
import VideoController from './video-controller';
import VideoPlayer from './video-player';
import { setValidTimer as countVideoPlayed } from 'common/utils/count-played';

export default {
  name: 'video-content',

  components: {
    // ContentInfo,
    VideoController,
    VideoPlayer,
  },

  props: {
    contentData: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },

  data() {
    const isMobile = UA.isMobile();

    return {
      isMobile,
      coverHeight: isMobile ? window.innerWidth * 0.5625 : 375 * 0.5625, // 封面高度

      isInline: true,
      videoController: null,
      videoPlayer: null,
      showPlayBtn: true,
    };
  },

  computed: {
    cover() {
      return this.contentData.cover.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn');
    },
  },

  mounted() {
    this.videoController = this.$refs.videoController;
    this.videoPlayer = this.$refs.videoPlayer;
  },

  methods: {
    play() {
      this.videoController.play();
    },

    onVideoPlay() {
      // 隐藏播放按钮
      this.showPlayBtn = false;

      // 统计播放次数
      countVideoPlayed({
        videoId: this.contentData.videoId,
        channel: 'owl_fx_preview',
        component: 'edu_fx_player',
      });
    },

    onVideoEnd() {
      if (this.videoController.isFullscreen) {
        this.videoController.toggleFullscreen(false);
      }
      this.showPlayBtn = true;
    },
  },
};
</script>

<style lang="scss">
.content-container--preview .video-content {
  position: relative;
  height: auto;

  &__content-info {
    margin-top: 56.25%;
  }

  &__video-wrapper {
    position: relative;
    width: 100%;
    height: 211px;
    overflow: hidden;
    box-sizing: border-box;

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
    z-index: 1001;
    width: 60px;
    height: 60px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAMAAADxhdbJAAAAulBMVEUAAAAAAAAAAAAAAAAAAAAAAACBgYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v5iYmIrKysaGhoQEBAAAAAAAAAAAADs7OzHx8f6+vr09PTw8PC0tLSZmZl0dHRERET39/fj4+Pb29vX19fR0dG9vb2hoaH7+/vo6Ojm5uavr6+FhYVUVFRQUFD///9wIZ9UAAAAPXRSTlNmAF9dYWOSTkwSBVgbAkgOLAk7HTUMOQtTPiUkRRT8hHFsakIxGeS/9+/psZ6MefHb0s7Ht6P539ytlH99tx4IiAAABA5JREFUaN7Nmuda2zAUhiVZjkfsONOGLEaStkAppUC37/+2KiDmBNdJ9EnO+P4wnthvzpKPpcM4okGv3W15J03huqJ54rW67d6AI9LGhVHfc1mFXK8fxfXisjmhKpH+PKsLFw59piF/GNaAC04l05Q8DSxxwbjKdVIoySr3jgML3KRV4jiOI1YorlD/KFFbE0Nc2C2h5BoflpDd0AQ3dFZZgm2UWCU6Qxg38Mr3qlb1N/IGGK4nCCaYpsTKRT0AF6eVMAiYxrq4jkdZwEBRPnkdPVzSLK7AYOWLmokObiIK0wQzkpDFL5PtuEhuMA00UEbbcJFLl9jz3GgzbiKL5YlZqVjq5GQTLhEUNjtJueQm63GdJn22Ll6zsw4Xe8tPuqwGuUueF6/BpYBtgH1pNa5H36oOkZd6VbiBWAaX1abijoMKnA/UG1h//v+4IUCDecMyLnSApITT0wlLuC4SODx83fe4CeZK3J3BO1zr1fS6WXTT1iouwI3DzSPcGA0cHr4Z4RK2exxL3nCnOA3nnRa4UO4DJ8MlbgjQLHjDJc4H0tIiOf1XXIcBRXdhXnose8G19Y27+DB9uDA2b/6C8/VDd5vn+fWtafD8Z1zs6ruykStNHy/N3OnGCheRuVo4pR9/zbwZKVwfx+Xfn4xwfYXzyLu6OKX7c4PgeQonmZJkIC6/+w3QlgCXswHREZzSxwvUPAWjTEFx+fUZGrwea8M40vQGwylY18CZpK9fEGcqGHUpAI706TPUsTCPkQAc6RtQEh47ITaEI101dM1TsCaVHYqjkrjUKzwFc2rA5R/O9HCi+GGHy6dPWqkpLXGkcy2cnTNJd5c6znTsUoWC90cvVWwKgfR4qVkIFmVOhXerXebGixjp4RxYxPAlGl80aYk2fQDRIwF7AEU2uOkvsBUzah5o7YKbBy7hVKGVGexr5VvjJ2HcVQNtxJiHt7X0VDVraxcYjtIfxy0ULi6CB+B+UvojoYvBF64G9XsmL1zo62QD62bLRY6+LJ+hvfq7W3fgrYCb+4btVgAf7WejY7TnbZz9blIdaguOz3aPmx1u+5SPsX12fK99zFdxwX63vnm64439wx5b8NEuD2VGhz5y4tnuDtSywx8Xct4HeACtv+WoV9R81HscB9mcJ049/iRPOsmmIYRA1DuEIIJjGrHgfCGKS1zjJCloIto+HhM4dY3HOAE4/ONamMaayTGONql679sPbvXjYx1LU8p8m6E7P4NHCkercds+Urj64ZHRwGRqNjCZ4gOT1bOnrqBxUPq7PH9qM+w6q3y0SCFkZRc1CyxHeRNklDepY1B51NKBtUZhXWPYnbYvN9rltzv1DpnHi7kvq1HzBTBkjiiL2unzCL0jpfM8Qp+2o4wj+gfblKJxDtrlbwAAAABJRU5ErkJggg==);
    background-size: 60px 60px;
    transform: translate(-50%, -50%);
  }

  &__cover-wrap {
    position: absolute;
    bottom: 0;
    z-index: 1001;
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
