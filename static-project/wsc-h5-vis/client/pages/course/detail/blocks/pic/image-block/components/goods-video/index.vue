<template>
  <div>
    <transition name="fade">
      <cap-video-controller
        ref="videoController"
        @video-play="onVideoPlay"
        @video-end="onVideoEnd"
      >
        <cap-video-player
          v-show="showplayer"
          ref="videoPlayer"
          slot-scope="props"
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
          :src="src"
          :cover="cover"
          :is-inline="isInline"
          @close-video="closeVideo"
          @toggle-fullscreen="toggleFullscreen"
        />
      </cap-video-controller>
    </transition>
  </div>
</template>

<script>
import VideoController from './video-controller';
import VideoPlayer from './video-player';

// 视频播放控制条高度，偷懒直接写了
const ACTION_BAR_HEIGHT = 50;

export default {
  name: 'goods-video',

  components: {
    'cap-video-controller': VideoController,
    'cap-video-player': VideoPlayer,
  },

  props: {
    showplayer: Boolean,
    src: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isInline: true,
      isPlayingWhenLeave: false,
      videoController: null,
      videoPlayer: null,
      swpInitHeight: 320,
      playingHeight: 0,
    };
  },

  watch: {
    // showplayer(val) {
    //   if (val) {
    //     this.playVideo();
    //   }
    // }
  },
  mounted() {
    this.videoController = this.$refs.videoController;
    this.videoPlayer = this.$refs.videoPlayer;
  },

  methods: {
    closeVideo() {
      const videoController = this.videoController;

      if (!this.isInline && !videoController.isFullscreen) {
        this.makeVideoInline();
        // 切回inline时如果是已播放完状态，则显示swiper的导航
        if (videoController.isStop) {
          this.$emit('changeShowPlayer', false);
          this.resetSwpStyle();
        }
      } else {
        // 切换为非全屏状态
        videoController.toggleFullscreen(false);
      }
      // 重置行动按钮隐藏倒计时
      videoController.resetAutoHideTimer();
    },
    onVideoPlay() {
      // 非暂停情况下播放，dom还没显示出来不能获取正确的高度
      this.$nextTick(() => {
        if (this.playingHeight) {
          return;
        }

        const videoHeight = this.$refs.videoPlayer.getVideoHeight();
        const newHeight = videoHeight + ACTION_BAR_HEIGHT * 2;

        if (newHeight > this.swpInitHeight) {
          this.playingHeight = newHeight;
        }
      });
    },
    onVideoEnd() {
      if (this.videoController.isFullscreen) {
        this.videoController.toggleFullscreen(false);
      }
      // inine状态下播放完，则显示出导航
      if (this.isInline) {
        this.$emit('changeShowPlayer', false);
        this.resetSwpStyle();
      } else {
        // 非inline状态下播放完，显示封面和控制条
        this.videoController.toggleActions(true);
      }
    },
    // 恢复轮播高度和导航
    resetSwpStyle() {
      this.$emit('changeShowIndicator', true);
      // this.$swpWrap.height(this.swpInitHeight);
    },
    // 将video嵌入轮播中
    makeVideoInline() {
      this.isInline = true;
      this.videoController.$el.appendChild(this.videoPlayer.$el);
    },
    // 将video从轮播中拎出来全屏播放
    makeVideoOutline() {
      this.isInline = false;
      document.body.appendChild(this.videoPlayer.$el);
    },
    // 在inline情况下点击全屏，只是将video从轮播中拎出来
    toggleFullscreen() {
      const videoController = this.videoController;

      if (this.isInline) {
        this.makeVideoOutline();
      } else {
        videoController.toggleFullscreen(!videoController.isFullscreen);
      }

      videoController.resetAutoHideTimer();
    },
    playVideo() {
      this.videoController.play();
      this.$emit('stopSwipe', true);
      // 开始播放时隐藏导航
      this.$emit('changeShowIndicator', false);
    },
    pauseVideo() {
      this.videoController.pause();
      this.$emit('stopSwipe', false);
    },
    toggleVideoPlay(isVideoInView) {
      // 视频被轮播切换走时是播放状态，切换回来才重新播放
      if (isVideoInView) {
        this.isPlayingWhenLeave && this.playVideo();
      } else {
        // 记录视频被切换走时当前的播放状态
        this.isPlayingWhenLeave = this.videoController.isPlaying;
        this.pauseVideo();
        // 切换到图片时显示导航
        this.$emit('changeShowIndicator', true);
      }
    },
  },
};
</script>
