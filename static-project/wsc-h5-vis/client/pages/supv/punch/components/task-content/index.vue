<template>
  <div class="m-task-content">
    <div
      v-for="(item, index) in taskContent"
      :key="index"
      :class="item.type === 'audio' ? 'u-audio' : ''"
    >
      <div
        v-if="item.type === 'rich_text'"
        class="rich-text custom-richtext"
        v-html="item.content"
      />
      <audio-player
        v-if="item.type === 'audio'"
        :title="item.title"
        :src="item.audio"
        :reload-when-pause="item.reload === '1'"
        :loop="item.loop === '1'"
        need-fetch-duration
      />
    </div>
  </div>
</template>

<script>
import AudioPlayer from '../audio-player';

export default {
  name: 'task-content',
  components: {
    'audio-player': AudioPlayer,
  },
  props: {
    taskContent: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss">
.u-audio {
  margin-top: 10px;
}
.rich-text {
  img {
    max-width: 100%;
  }

  &.custom-richtext > * {
    width: inherit !important;
  }

  &.custom-richtext {
    padding: 0;
    h1,
    h2,
    h3,
    h4 {
      font-weight: bold;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.17em;
    }
  }
}
</style>
