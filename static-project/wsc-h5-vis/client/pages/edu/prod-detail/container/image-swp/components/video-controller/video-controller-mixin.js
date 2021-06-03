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
    play() {
      this.videoEventBus.$emit('video:play');
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
    this.setVideoEl(this.$refs.video);
    enableInlineVideo(this.$refs.video);
  },
};
