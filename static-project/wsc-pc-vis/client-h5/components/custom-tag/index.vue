<template>
  <div class="custom-tag">
    <span class="custom-tag__text">
      {{ tagText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'custom-tag',
  props: {
    tagText: {
      type: String,
      default: '',
    },
  },
  data() {

  },
};
</script>

<style lang="scss">
.custom-tag {
  display: inline-block;

  &__text {
    display: inline-block;
    margin-right: 5px;
    padding: 0 4px;
    line-height: 16px;
    vertical-align: 2px;
    font-size: 12px;
    color: #00b389;
    background: #fff;
    border-radius: 8px;
  }
}
</style>
