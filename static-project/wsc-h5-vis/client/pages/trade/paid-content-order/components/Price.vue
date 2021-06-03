<template>
  <div class="paid-content__price-wrap">
    <div v-if="discoutPrice || usePoints" class="paid-content__price-item">
      <span class="paid-content__price-label">
        商品金额
      </span>
      <span v-if="usePoints" class="paid-content__price-value">
        <vis-points :points="pointsInfo.pointsPrice" :price="pointsInfo.remainPrice" />
      </span>
      <span v-else class="paid-content__price-value">
        {{ originPriceTotal }}元
      </span>
    </div>
    <div v-if="discoutPrice || usePoints" class="paid-content__price-item">
      <span class="paid-content__price-label">
        活动优惠
      </span>
      <span class="paid-content__price-value">
        {{ discount }}元
      </span>
    </div>
    <div v-if="Number(prepayCardDecreasePrice) > 0" class="paid-content__price-item">
      <span class="paid-content__price-label">
        余额/卡
      </span>
      <span class="paid-content__price-value">
        - {{ prepayCardDecreasePrice }}元
      </span>
    </div>
    <div class="paid-content__price-item">
      <span class="paid-content__price-label">
        合计
      </span>
      <template v-if="usePoints">
        <span v-if="pointsInfo" class="paid-content__price-value total-value">
          <vis-points class-name="active" :points="pointsInfo.pointsPrice" :price="pointsRemainPrice" />
        </span>
      </template>
      <span v-else class="paid-content__price-value total-value">
        {{ total }}元
      </span>
    </div>
  </div>
</template>

<script>
import PointsPrice from './PointsPrice';

export default {
  name: 'price',

  components: {
    'vis-points': PointsPrice,
  },

  props: {
    originPrice: {
      type: Number,
      default: 0,
    },
    discoutPrice: {
      type: Number,
      default: 0,
    },
    prePayCardPrice: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 1,
    },
    usePoints: {
      type: Boolean,
      default: false,
    },
    pointsInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {};
  },

  computed: {
    price() {
      return (this.originPrice / 100).toFixed(2);
    },

    discount() {
      return (this.discoutPrice / 100).toFixed(2);
    },

    originPriceTotal() {
      const sum = (this.originPrice * this.count);
      return (sum / 100).toFixed(2);
    },

    prepayCardDecreasePrice() {
      const usedPrePayCardPrice = this.$store.getters['usedPrePayCardPrice'] || 0;
      return (usedPrePayCardPrice / 100).toFixed(2);
    },

    total() {
      const usedPrePayCardPrice = this.$store.getters['usedPrePayCardPrice'] || 0;
      const sum = (this.originPrice * this.count) - this.discoutPrice - usedPrePayCardPrice;
      return (sum / 100).toFixed(2);
    },

    pointsRemainPrice() {
      if (!this.usePoints) return 0;
      const usedPrePayCardPrice = this.$store.getters['usedPrePayCardPrice'] || 0;
      const remainPrice = this.pointsInfo.remainPrice - usedPrePayCardPrice;
      return remainPrice;
    },
  },
};
</script>

<style lang="scss">
@import "var";

.paid-content__price-wrap {
  margin-top: 10px;
  padding: 15px;
  background-color: #fff;

  .paid-content__price-item {
    font-size: 14px;
    line-height: 25px;
    .paid-content__price-label {
      color: $c-black;
    }

    .paid-content__price-value {
      float: right;
      color: $c-gray-darker;

      &.total-value {
        color: $c-red-light;
      }
    }
  }
}
</style>
