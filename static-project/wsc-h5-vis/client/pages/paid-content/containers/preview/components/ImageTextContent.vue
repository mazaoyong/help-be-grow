<template>
  <div class="image-text">
    <div
      class="image-text__cover-wrap"
      :style="{
        height: `${coverHeight}px`,
        background: `url(${cover}) center / cover no-repeat`
      }"
    />
    <slot name="content-info" />
  </div>
</template>

<script>
export default {
  name: 'image-text-content',

  props: {
    contentData: {
      type: Object,
      default: function() {
        return {};
      },
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
  },
};
</script>

<style lang="scss">
.content-container--preview .image-text {
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
