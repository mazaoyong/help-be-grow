<template>
  <div
    :style="style"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove="onTouchMove"
    class="swiper"
  >
    <slot />
  </div>
</template>

<script>
import {
  THRESHOLD,
  GUTTER,
  ENTERED_WIDTH,
  LEAVED_WIDTH,
} from './constants';

export default {
  name: 'swiper',

  props: {
    height: {
      type: Number,
      default: 173,
    },
  },

  data() {
    return {
      startX: 0,
      left: 0,
      innerTranslateX: 0,
      isSwiperTouchEnded: false,
      currentIndex: 0,
      swiperItems: [],
      steps: [],
    };
  },

  computed: {
    style() {
      const style = {
        transform: `translateX(${this.translateX}px)`,
        left: `${this.left}px`,
        height: `${this.height}px`,
      };
      if (this.isTouchEnded) {
        style.transition = 'transform .3s ease-out';
      }
      return style;
    },

    translateX: {
      set(translateX) {
        this.innerTranslateX = translateX;

        this.swiperItems[this.currentItemIndex].translateX = this.translateX;
        if (this.swiperItems[this.currentItemIndex - 1]) {
          this.swiperItems[this.currentItemIndex - 1].translateX = this.translateX;
        }
        if (this.swiperItems[this.currentItemIndex + 1]) {
          this.swiperItems[this.currentItemIndex + 1].translateX = this.translateX;
        }
      },
      get() {
        return this.innerTranslateX;
      },
    },

    isTouchEnded: {
      set(isTouchEnded) {
        this.isSwiperTouchEnded = isTouchEnded;

        this.swiperItems[this.currentItemIndex].isTouchEnded = this.isTouchEnded;
        if (this.swiperItems[this.currentItemIndex - 1]) {
          this.swiperItems[this.currentItemIndex - 1].isTouchEnded = this.isTouchEnded;
        }
        if (this.swiperItems[this.currentItemIndex + 1]) {
          this.swiperItems[this.currentItemIndex + 1].isTouchEnded = this.isTouchEnded;
        }
      },
      get() {
        return this.isSwiperTouchEnded;
      },
    },

    currentItemIndex: {
      set(currentItemIndex) {
        this.currentIndex = currentItemIndex;

        this.swiperItems[this.currentIndex].currentItemIndex = this.currentItemIndex;
        if (this.swiperItems[this.currentIndex - 1]) {
          this.swiperItems[this.currentIndex - 1].currentItemIndex = this.currentItemIndex;
        }
        if (this.swiperItems[this.currentIndex + 1]) {
          this.swiperItems[this.currentIndex + 1].currentItemIndex = this.currentItemIndex;
        }

        this.$emit('change', currentItemIndex);
      },
      get() {
        return this.currentIndex;
      },
    },
  },

  mounted() {
    if (this.$slots.default.length && this.$slots.default.length > 1) {
      const swiperItems = this.$slots.default.map(item => item.componentInstance);
      swiperItems.forEach(item => {
        item.currentItemIndex = this.currentItemIndex;
      });
      this.swiperItems = swiperItems;
    }

    // 计算滑动步长
    this.steps = this.getSteps(this.$slots.default.length);

    // 注册过渡结束事件
    const transitionendListener = () => {
      this.left = 0;
      for (let i = 0; i < this.currentIndex; i++) {
        this.left += this.getStep(i, 'backward');
      }
      this.translateX = 0;
      this.isTouchEnded = false;
    };
    this.$el.addEventListener('transitionend', transitionendListener);
  },

  methods: {
    onTouchStart(e) {
      if (this.swiperItems.length <= 1) return;

      console.log('touchstart', e);
      const finger = e.touches[0];
      this.startX = finger.clientX;
    },
    onTouchEnd(e) {
      if (this.swiperItems.length <= 1) return;

      if (this.translateX > THRESHOLD && this.currentItemIndex !== 0) {
        this.translateX = this.getStep(this.currentIndex, 'forward');
        this.currentItemIndex -= 1;
      } else if (this.translateX < -THRESHOLD && this.currentItemIndex !== this.swiperItems.length - 1) {
        this.translateX = this.getStep(this.currentIndex, 'backward');
        this.currentItemIndex += 1;
      } else {
        this.translateX = 0;
      }
      this.startX = 0;
      this.isTouchEnded = true;
      console.log('touchend', e, this.translateX);
    },
    onTouchMove(e) {
      if (this.swiperItems.length <= 1) return;

      const finger = e.touches[0];
      this.translateX = finger.clientX - this.startX;
    },

    getSteps(length) {
      if (!length || length === 1) {
        return [0];
      }

      const vw = window.innerWidth;

      if (length === 2) {
        return [
          ENTERED_WIDTH + LEAVED_WIDTH + 3 * GUTTER - vw,
        ];
      }

      const steps = [];
      for (let i = 0; i < length - 1; i++) {
        if (i === 0 || i === length - 2) {
          steps.push(
            (LEAVED_WIDTH + GUTTER) - vw / 2 + ENTERED_WIDTH / 2 + GUTTER
          );
        } else {
          steps.push(
            LEAVED_WIDTH / 2 + LEAVED_WIDTH / 2 + 10
          );
        }
      }
      return steps;
    },

    getStep(index, type) {
      if (type === 'forward') {
        return this.steps[index - 1];
      } else {
        return -this.steps[index];
      }
    },
  },
};
</script>

<style lang="scss">
.swiper {
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
}
</style>
