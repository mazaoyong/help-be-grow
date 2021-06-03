<template>
  <div v-if="pageCount" class="swiper-pagation">
    <span
      v-for="(item, index) in pageCount"
      :key="item"
      class="swiper-pagation__item"
      :class="{'swiper-pagation__item--active': index === currentIndex}"
    />
  </div>
</template>
<script>
export default {
  name: 'swiper-pagation',

  props: {
    pageCount: {
      type: Number,
      default: 0,
    },

    currentIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper-pagation {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  &__item {
    display: inline-block;
    margin-right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, .5);

    &:last-child {
      margin-right: 0;
    }

    &--active {
      background-color: #fff;
    }
  }
}
</style>
