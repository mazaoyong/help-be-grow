<template>
  <div :class="['join-count-banner', `color-style-${colorStyle}`]">
    <p class="text">已有{{ count }}人得到奖励</p>
  </div>
</template>

<script>
export default {
  name: 'join-count-banner',

  props: {
    count: {
      type: Number,
      default: 0,
    },
    colorStyle: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.join-count-banner {
  height: 26px;
  width: 137px;
  padding: 0 24px;
  text-align: center;

  &.color-style-0 {
    color: #fff;
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 35%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 65%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &.color-style-1 {
    color: #e2a279;
    background-image: linear-gradient(
      90deg,
      rgba(224, 165, 103, 0) 0%,
      rgba(224, 165, 103, 0.1) 35%,
      rgba(224, 165, 103, 0.2) 50%,
      rgba(224, 165, 103, 0.1) 65%,
      rgba(224, 165, 103, 0) 100%
    );
  }

  &.color-style-2 {
    color: #D07348;
    background-image: linear-gradient(
      90deg,
      rgba(255, 157, 25, 0) 0%,
      rgba(255, 157, 25, 0.1) 35%,
      rgba(255, 157, 25, 0.2) 50%,
      rgba(255, 157, 25, 0.1) 65%,
      rgba(255, 157, 25, 0) 100%
    );
  }

  &.color-style-3 {
    color: #87A369;
    background-image: linear-gradient(
      90deg,
      rgba(201, 225, 139, 0) 0%,
      rgba(201, 225, 139, 0.1) 35%,
      rgba(201, 225, 139, 0.2) 50%,
      rgba(201, 225, 139, 0.1) 65%,
      rgba(201, 225, 139, 0) 100%
    );
  }

  .text {
    line-height: 26px;
    font-size: 12px;
  }
}
</style>
