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
    margin-right: 4px;
    width: 7px;
    height: 4px;
    border-radius: 5px;
    background-color: #c8c9cc;

    &:last-child {
      margin-right: 0;
    }

    &--active {
      width: 14px;
      background-color: #00B389;
    }
  }
}
</style>
