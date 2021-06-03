<template>
  <card-cell class="points-cell" :title="shop.pointsName" :is-link="false">
    <template>
      <span v-for="item in value" :key="item" class="points-cell__value">
        {{ item }}
      </span>
    </template>
  </card-cell>
</template>

<script>
import { CardCell } from '@/pages/trade/buy/components/card';

export default {
  name: 'points-cell',

  components: {
    CardCell,
  },

  state: ['pointsExchange', 'shop'],

  getters: ['isOrderCreated'],

  computed: {
    value() {
      const { userPoints, pointsName } = this.shop;
      return [
        `共${userPoints}${pointsName}，本单抵扣`,
        `${this.pointsExchange.pointsPrice}${pointsName}`,
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.points-cell__value {
  display: inline-block;
}
</style>
