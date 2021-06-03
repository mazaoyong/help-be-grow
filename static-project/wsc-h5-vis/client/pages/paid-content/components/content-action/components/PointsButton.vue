<template>
  <div class="points-button buy-btn">
    <!-- $theme.colors.vice -->
    <van-goods-action-big-btn
      :class="pointsBuyLimit ? 'main-btn' : 'vice-btn'"
      @click="onClickToExchange"
    >
      {{ pointsName }}兑换
    </van-goods-action-big-btn>
    <van-goods-action-big-btn
      v-if="!pointsBuyLimit"
      class="main-btn"
      primary
      @click="onClickToBuy"
    >
      <div class="goods-action__price">
        {{ pricePrefixLabel }}
      </div>
    </van-goods-action-big-btn>
  </div>
</template>

<script>
import { GoodsActionButton, Toast } from 'vant';

const global = window._global;

export default {
  name: 'points-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
  },

  props: {
    timelimitedDiscountInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      pointsName: global.visPointsName || '积分',
    };
  },

  computed: {
    pricePrefixLabel() {
      return this.isColumn ? '购买专栏' : '购买内容';
    },
    pointsBuyLimit() {
      return this.data.buyLimit;
    },
  },

  methods: {
    onClickToBuy(event) {
      // 积分活动不能和限时秒杀并存
      this.$emit('onClickToBuy', 0, event);
    },
    onClickToExchange(event) {
      // 检查是否到达限购数量
      if (this.data.quotaNum <= this.data.quotaUsed) {
        Toast(`限购${this.data.quotaNum}件，你已兑换${this.data.quotaUsed}件`);
        return;
      }
      this.$emit('onClickToBuy', 5, event);
    },
  },
};
</script>
