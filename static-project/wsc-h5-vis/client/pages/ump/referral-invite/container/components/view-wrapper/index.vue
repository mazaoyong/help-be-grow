<template>
  <div
    class="view-wrapper"
    :class="{'view-padding': showPadding}"
  >
    <slot v-if="title" name="title">
      <p class="view-wrapper__title">
        {{ title }}
      </p>
    </slot>
    <slot />
  </div>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
export default {
  name: 'view-wrapper',

  props: {
    title: {
      type: String,
      default: '',
    },
    showPadding: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.view-wrapper {
  border-radius: 8px;
  background-color: #fff;
  margin: 16px 12px;
  box-sizing: border-box;
  overflow: hidden;

  &__title {
    padding: 16px 12px 0 12px;
    font-size: 20px;
    line-height: 28px;
    color: #323233;
    font-weight: bold;
  }
}

.view-wrapper.view-padding {
  padding: 16px;
}
</style>
