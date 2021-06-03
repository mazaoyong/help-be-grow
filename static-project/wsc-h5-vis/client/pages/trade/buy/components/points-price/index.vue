<template>
  <div v-theme.main class="points-price">
    <div class="points-price__block">
      <span>{{ pointsPrice }}</span>
      <span class="points-price__unit">{{ pointsName }}</span>
    </div>

    <div v-if="price" class="points-price__block">
      <span class="points-price__unit">+</span>
      <cap-price class="points-price__cap-price" :price="price" />
      <span class="points-price__unit">元</span>
    </div>
  </div>
</template>

<script>
import { Price } from '@youzan/captain';

export default {
  name: 'points-price',

  components: {
    'cap-price': Price,
  },

  props: {
    pointsPrice: {
      type: Number,
      required: true,
    },

    pointsName: {
      type: String,
      default: '积分',
    },

    price: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.points-price {
  font-size: 16px;
  font-weight: bold;

  &__block {
    display: inline-block;
    white-space: nowrap;
  }

  &__unit {
    font-size: 12px;
    font-weight: 500;
  }

  &__cap-price {
    font-size: 0;
  }

  .cap-price__unit {
    display: none;
  }
}
</style>
