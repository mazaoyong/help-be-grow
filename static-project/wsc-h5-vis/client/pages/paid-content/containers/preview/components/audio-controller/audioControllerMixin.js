export default {
  props: {
    audioEventBus: Object,
    percentage: Number,
    isStop: Boolean,
    duration: Number,
    formatedCurrentTime: String,
    formatedDuration: String,
    isPlaying: Boolean,
  },

  methods: {
    /**
     * 播放音频
     */
    play() {
      this.audioEventBus.$emit('audio:play');
    },
    /**
     * 暂停音频
     */
    pause() {
      this.audioEventBus.$emit('audio:pause');
    },
    /**
     * 快进
     */
    forward() {
      this.audioEventBus.$emit('audio:forward');
    },
    /**
     * 快退
     */
    back() {
      this.audioEventBus.$emit('audio:back');
    },
    /**
     * 重播音频
     */
    replay() {
      this.audioEventBus.$emit('audio:replay');
    },
    /**
     * 重置音频
     */
    resetAudio() {
      this.audioEventBus.$emit('audio:reset');
    },
    /**
     * 播放进度跳转
     *
     * @param  {number} percentage 播放进度百分比
     */
    updateProgress(percentage) {
      this.audioEventBus.$emit('audio:progress:update', percentage);
    },

    showTip() {
      this.audioEventBus.$emit('audio:tip');
    },
  },
};
