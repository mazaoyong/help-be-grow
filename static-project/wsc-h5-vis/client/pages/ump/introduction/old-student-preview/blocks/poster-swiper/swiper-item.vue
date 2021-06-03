<template>
  <div :style="style" class="swiper-item">
    <slot />
  </div>
</template>
<script>
import { actualWidth, actualHeight, scale } from '../../../constants';
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      scale,
      currentItemIndex: 0,
      isTouchEnded: false,
    };
  },

  computed: {
    style() {
      const style = {
        transform: `scale(${this.isActive ? 1 : 0.85})`,
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
      };
      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-item {
  flex-shrink: 0;
  border-radius: 8px;
  transform-origin: center;
  overflow: hidden;
}
</style>
