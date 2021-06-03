<template>
  <div ref="swiperContainer" class="swiper-container">
    <div :style="style" class="swiper">
      <slot />
    </div>
    <swiper-pagation :page-count="pageCount" :current-index="currentIndex" />
  </div>
</template>

<script>
import SwiperPagation from './swiper-pagation';
import { actualWidth, gutter } from '../../../constants';
export default {
  components: {
    SwiperPagation,
  },

  data() {
    return {
      swiperItems: [],
      currentIndex: 0,
    };
  },

  props: {
    pageCount: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    style() {
      const translateX = -(this.currentIndex * actualWidth);
      const style = {
        transform: `translate3d(${translateX}px, 0, 0)`,
        width: `${this.swiperItemsLength * actualWidth}px`,
        padding: `0 ${gutter}px`,
      };
      return style;
    },

    swiperItemsLength() {
      return this.swiperItems.length;
    },
  },

  mounted() {
    if (this.$slots.default.length) {
      const swiperItems = this.$slots.default.map((item) => item.componentInstance);
      swiperItems.forEach((item) => {
        item.currentItemIndex = this.currentIndex;
      });
      this.swiperItems = swiperItems;
    }
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
