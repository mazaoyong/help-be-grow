<template>
  <div class="auido-content">
    <div
      class="audio-content__cover-wrap"
      :style="{
        height: `${coverHeight}px`,
        background: `url(${cover}) center / cover no-repeat`
      }"
    />

    <audio-controller
      ref="audioController"
      :audio-url="audioUrl"
      :audio-title="contentData.title"
    >
      <template slot-scope="props">
        <audio-player
          :audio-event-bus="props.audioEventBus"
          :percentage="props.percentage"
          :is-stop="props.isStop"
          :duration="props.duration"
          :formated-current-time="props.formatedCurrentTime"
          :formated-duration="props.formatedDuration"
          :is-playing="props.isPlaying"
        />
      </template>
    </audio-controller>

    <slot name="content-info" />
  </div>
</template>

<script>
import AudioController from './audio-controller';
import AudioPlayer from './audio-player';

export default {

  name: 'audio-content',

  components: {
    AudioController,
    AudioPlayer,
  },

  props: {
    contentData: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    const onPC = window.innerWidth > 600;

    return {
      coverHeight: onPC ? 210 : window.innerWidth / 16 * 9,
    };
  },

  computed: {
    cover() {
      return this.contentData.cover.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn');
    },
    audioUrl() {
      return this.contentData.content ? this.contentData.content.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn') : '';
    },
  },

  beforeRouteLeave(to, from, next) {
    this.$refs.audioController && this.$refs.audioController.destroy();
    next();
  },
};
</script>

<style lang="scss">
.content-container--preview .audio-content {
  position: relative;

  &__cover-wrap {
    position: relative;
    width: 100%;
  }

  &__cover {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>
