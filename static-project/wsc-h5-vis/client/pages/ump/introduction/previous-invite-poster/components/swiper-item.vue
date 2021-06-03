<template>
  <div
    :style="style"
    class="swiper-item"
  >
    <slot />
  </div>
</template>
<script>
import { actualWidth, actualHeight, scale, threshold } from '../../previous-old-student/constants';
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      scale,
      currentItemIndex: 0,
      isTouchEnded: false,
      translateX: 0,
    };
  },

  computed: {
    style() {
      const style = {
        transform: `scale(${this.scale})`,
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
      };
      if (this.isTouchEnded) {
        style.transition = 'transform .3s ease-out';
      }

      return style;
    },
  },

  watch: {
    currentItemIndex: {
      handler(index) {
        if (index === this.index) {
          this.scale = 1;
        } else {
          this.scale = scale;
        }
      },
      immediate: true,
    },

    translateX(newV) {
      const isLeaving = this.index === this.currentItemIndex;
      const isEntering = newV > 0
        ? this.index === this.currentItemIndex - 1
        : this.index === this.currentItemIndex + 1;
      if (!this.isTouchEnded) {
        const translateX = Math.abs(newV);
        let percent = translateX / threshold;
        if (percent > 1) percent = 1;
        if (isLeaving) {
          this.scale = 1 - (1 - scale) * percent;
        } else if (isEntering) {
          this.scale = scale + (1 - scale) * percent;
        }
      }
    },

    isTouchEnded(bool) {
      if (this.currentItemIndex === this.index) {
        this.scale = 1;
      } else {
        this.scale = scale;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-item {
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  transform-origin: center;
  overflow: hidden;
}
</style>
