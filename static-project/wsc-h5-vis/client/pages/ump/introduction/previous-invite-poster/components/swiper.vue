<template>
  <div ref="swiperContainer" class="swiper-container">
    <div
      :style="style"
      class="swiper"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchmove="onTouchMove"
      @mousedown="onTouchStart"
      @mousemove="onTouchMove"
      @mouseup="onTouchEnd"
    >
      <slot />
    </div>
    <swiper-pagation :page-count="swiperItems.length" :current-index="currentIndex" />
  </div>
</template>

<script>
import SwiperPagation from './swiper-pagation';
import { actualWidth, threshold, gutter } from '../../previous-old-student/constants';
export default {
  components: {
    SwiperPagation,
  },

  data() {
    return {
      isTouchEnded: true,
      translateX: 0,
      currentIndex: 0,
      startX: 0,
      endX: 0,
      swiperItems: [],
      innerTranslateX: 0,
    };
  },

  computed: {
    style() {
      const style = {
        transform: `translate3d(${this.translateX}px, 0, 0)`,
        width: `${this.swiperItemsLength * actualWidth}px`,
        padding: `0 ${gutter}px`,
      };
      if (this.isTouchEnded) {
        style.transition = 'transform .3s ease-out';
      }

      return style;
    },

    swiperItemsLength() {
      return this.swiperItems.length;
    },
  },

  watch: {
    currentIndex(index) {
      this.swiperItems[index].currentItemIndex = index;
      if (this.swiperItems[index - 1]) {
        this.swiperItems[index - 1].currentItemIndex = index;
      }
      if (this.swiperItems[index + 1]) {
        this.swiperItems[index + 1].currentItemIndex = index;
      }

      this.$emit('change', index);
    },

    isTouchEnded(bool) {
      this.swiperItems[this.currentIndex].isTouchEnded = bool;
      if (this.swiperItems[this.currentIndex - 1]) {
        this.swiperItems[this.currentIndex - 1].isTouchEnded = bool;
      }
      if (this.swiperItems[this.currentIndex + 1]) {
        this.swiperItems[this.currentIndex + 1].isTouchEnded = bool;
      }
    },

    endX(endX) {
      this.swiperItems[this.currentIndex].translateX = endX;
      if (this.swiperItems[this.currentIndex - 1]) {
        this.swiperItems[this.currentIndex - 1].translateX = endX;
      }
      if (this.swiperItems[this.currentIndex + 1]) {
        this.swiperItems[this.currentIndex + 1].translateX = endX;
      }
    },

  },

  mounted() {
    if (this.$slots.default.length) {
      const swiperItems = this.$slots.default.map(item => item.componentInstance);
      swiperItems.forEach(item => {
        item.currentItemIndex = this.currentIndex;
      });
      this.swiperItems = swiperItems;
    }

    this.$refs.swiperContainer.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
    this.$refs.swiperContainer.addEventListener('mousemove', function(e) {
      e.preventDefault();
    }, { passive: false });
  },

  methods: {
    onTouchStart(e) {
      if (this.swiperItemsLength <= 1) {
        return;
      }
      this.isTouchEnded = false;
      const finger = e.touches ? e.touches[0] : e;
      this.startX = finger.clientX;
    },

    onTouchEnd(e) {
      this.isTouchEnded = true;
      if (this.swiperItemsLength <= 1) {
        return;
      }
      if (this.innerTranslateX === this.translateX) {
        return;
      }

      if (this.endX > threshold && this.currentIndex !== 0) {
        this.currentIndex -= 1;
        this.translateX = this.innerTranslateX + actualWidth;
      } else if (this.endX < -threshold && this.currentIndex !== this.swiperItemsLength - 1) {
        this.currentIndex += 1;
        this.translateX = -this.currentIndex * actualWidth;
      } else if (this.currentIndex === 0) {
        this.translateX = 0;
      } else {
        this.translateX = this.innerTranslateX;
      }

      this.innerTranslateX = this.translateX;
    },

    onTouchMove(e) {
      if (this.isTouchEnded || this.swiperItemsLength <= 1) {
        return;
      }
      const finger = e.touches ? e.touches[0] : e;
      this.endX = finger.clientX - this.startX;
      this.translateX = this.innerTranslateX + this.endX;
    },

  },
};
</script>

<style scoped>
.swiper-container {
  padding-bottom: 20px;
  position: relative;
  overflow: hidden;
}
.swiper {
  display: flex;
  align-items: center;
}
</style>
