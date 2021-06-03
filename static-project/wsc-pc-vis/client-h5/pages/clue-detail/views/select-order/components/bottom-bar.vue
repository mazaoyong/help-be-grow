<template>
  <div class="select-order-bottom-bar" :class="{ fixed }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss">
.select-order-bottom-bar {
  display: flex;
  height: 50px;
  background-color: white;

  button {
    flex: auto;
    width: 100%;
    height: 100%;
    border: 0;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);

    &.van-button--primary {
      background-color: #00b389;
      color: white;
    }
  }

  &.fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
}
</style>
