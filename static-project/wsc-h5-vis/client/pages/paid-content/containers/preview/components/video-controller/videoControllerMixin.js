import enableInlineVideo from 'iphone-inline-video';

export default {
  props: {
    src: String,
    videoEventBus: Object,
    setVideoEl: Function,
    currentTime: String,
    duration: String,
    percentage: Number,
    loadedPercentage: Number,
    loadedStartPercentage: Number,
    isPlaying: Boolean,
    isStop: Boolean,
    isPause: Boolean,
    isLoading: Boolean,
    isFullscreen: Boolean,
    isShowActions: Boolean,
  },

  methods: {
    pause() {
      this.videoEventBus.$emit('video:pause');
    },
    play(current = 0) {
      this.videoEventBus.$emit('video:play', current);
    },
    updateProgress(percentage) {
      this.videoEventBus.$emit('video:progress:update', percentage);
    },
    onProgressStart() {
      this.videoEventBus.$emit('video:progress:start');
    },
    onProgressEnd() {
      this.videoEventBus.$emit('video:progress:end');
    },
    toggleFullscreen() {
      this.videoEventBus.$emit('video:fullscreen:toggle', !this.isFullscreen);
    },
    toggleActionsDisplay() {
      this.videoEventBus.$emit('video:actions:toggle', !this.isShowActions);
    },
  },

  mounted() {
    // 特殊逻辑，如果url有这个标识，不做任何处理
    if (location.href.indexOf('purevideo') < 0) {
      enableInlineVideo(this.$refs.video);
    }
  },
};
