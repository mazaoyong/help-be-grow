<template>
  <card v-if="isShowCard">
    <!-- 积分商城 -->
    <points-cell v-if="isPointsExchange" />

    <!-- 预付卡 -->
    <prepay-card-cell v-if="isShowPrepayCardCell" />
  </card>
</template>

<script>
import { Card } from '@/pages/trade/buy/components/card';
import PrepayCardCell from './components/prepay-card-cell';
import PointsCell from './components/points-cell';

export default {
  name: 'assets-block',

  components: {
    Card,
    PrepayCardCell,
    PointsCell,
  },

  state: ['giftCard', 'valueCard', 'prepayCard'],

  getters: [
    'giftCardDecrease',
    'valueCardDecrease',
    'isPointsExchange',
    'isOrderCreated',
  ],

  computed: {
    isShowCard() {
      return this.isPointsExchange || this.isShowPrepayCardCell;
    },

    isShowPrepayCardCell() {
      return this.prepayCard.showPrePayCards;
    },
  },
};
</script>
