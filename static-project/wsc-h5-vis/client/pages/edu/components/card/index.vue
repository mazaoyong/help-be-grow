<template>
  <div
    :style="extendStyle"
    class="vis-card"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'vis-card',
  props: {
    extendStyle: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-card {
  box-sizing: border-box;
  margin: 10px;
  padding: 15px 12px;
  border-radius: 6px;
  background-color: #fff;
}
</style>
