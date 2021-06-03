<template>
  <span class="mini-tag" :style="{ backgroundColor, color }">
    <span class="tag" :style="{ lineHeight: height }">
      {{ text }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.mini-tag {
  padding: 0 5px;
  display: inline-block;
  border-radius: 999px;
  background-color: #999;
  color: $white;

  .tag {
    @include mini-font;

    display: block;
    line-height: 18px;
  }
}
</style>
