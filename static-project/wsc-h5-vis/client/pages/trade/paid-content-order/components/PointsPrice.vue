<template>
  <span class="order__points-price" :class="className">
    <span class="order__points-price--points">
      {{ points }}{{ pointsName }}
    </span>
    <span v-if="price" class="order__points-price--price">
      + {{ (price / 100).toFixed(2) }}元
    </span>
  </span>
</template>

<script>
export default {
  name: 'points-price',

  props: {
    points: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    className: {
      type: [String, Object],
      default: '',
    },
  },

  inject: ['pointsName'],
};
</script>

<style lang="scss">
@import "var";

.order__points-price.active {
  color: $c-red-light;
}
</style>
