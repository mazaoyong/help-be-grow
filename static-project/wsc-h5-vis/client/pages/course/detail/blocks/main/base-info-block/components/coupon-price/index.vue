<template>
  <div class="coupon-price">
    <div class="price-line">
      <self-price-label
        class="min-price"
        :suffix="isActivityRangePrice ? '起': ''"
        :price="minPrice"
        :price-font-size="currentPriceSizes[0]"
        :text-font-size="currentPriceSizes[1]"
        :font-color="mainColor"
        :is-price-bold="false"
      />
      <self-price-label
        class="activity-line"
        :prefix="activityData.priceTag"
        :suffix="isCouponRangePrice ? '起': ''"
        :price="minCouponPrice"
        :price-font-size="couponPricefontSizes[0]"
        :text-font-size="couponPricefontSizes[1]"
        :font-color="'#FFF'"
        :back-color="mainColor"
      />

      <!-- <div
        v-if="goodsData.origin"
        class="origin"
      >
        <span class="origin-prev">原价</span>
        <span class="custom-origin">
          ¥{{ goodsData.origin }}
        </span>
      </div> -->
    </div>
    <div
      v-if="showOriginPrice"
      class="origin"
    >
      <span v-if="hasActivityPrice">
        <span class="origin-prev">原价</span>
        <old-price
          class="origin-price"
          :price="goodsPrice"
          no-split
        />
      </span>
      <span
        v-else-if="goodsData.origin"
        class="custom-origin"
      >
        ¥{{ goodsData.origin }}
      </span>
    </div>
  </div>
</template>

<script>
import CoustomPriceLabel from '@/pages/course/detail/components/price-label';
import { get } from 'lodash';
import { PriceLabel } from '@youzan/vis-ui';

const { OldPrice } = PriceLabel;

export default {
  components: {
    // 'vis-price-old': OldPrice,
    OldPrice,
    'self-price-label': CoustomPriceLabel,
  },

  rootState: ['activityData', 'goodsData'],

  rootGetters: [],

  computed: {
    mainColor() {
      return this.$theme.colors.main;
    },
    hasActivityPrice() {
      const { sku } = this.activityData;
      return (
        sku && Number.isInteger(sku.minPrice) && Number.isInteger(sku.maxPrice)
      );
    },
    showOriginPrice() {
      return this.hasActivityPrice || this.goodsData.origin;
    },
    isActivityRangePrice() {
      if (this.hasActivityPrice) {
        return !(
          this.activityData.sku.minPrice === this.activityData.sku.maxPrice
        );
      }
      if (
        Number.isInteger(this.minPrice) &&
        Number.isInteger(this.maxPrice) &&
        this.minPrice !== this.maxPrice
      ) {
        return true;
      }
      return false;
    },
    isCouponRangePrice() {
      let skuOptimalCoupons = get(
        this.activityData,
        'coupon.skuPreferenceList',
        [],
      );
      if (skuOptimalCoupons.length <= 1) {
        return false;
      }
      const totalPreferentialPrice = skuOptimalCoupons.map(
        (item) => item.preferentialPrice || 0,
      );
      const uniqPrices = Array.from(new Set(totalPreferentialPrice));
      if (uniqPrices.length <= 1) return false;
      return true;
    },
    goodsPrice() {
      return [this.goodsData.sku.minPrice, this.goodsData.sku.maxPrice];
    },
    originPrice() {
      return this.goodsData.origin;
    },
    currentPrice() {
      if (this.hasActivityPrice) {
        return [this.activityData.sku.minPrice, this.activityData.sku.maxPrice];
      }
      return this.goodsPrice;
    },
    minPrice() {
      return this.currentPrice[0];
    },
    maxPrice() {
      return this.currentPrice[1];
    },
    minCouponPrice() {
      return this.activityData.sku.minCouponPrice;
    },
    minPriceLen() {
      const minPriceStr = this.minPrice.toString();
      const length = minPriceStr.length;
      return length;
    },
    currentPriceSizes() {
      // 1-2 限时、拼团折扣价格存在4位数及以上的情况：现价整数缩小至14、小数缩小至10
      if (this.minPriceLen >= 6) {
        return [14, 10];
      }
      return [18, 12];
    },
    couponPricefontSizes() {
      // 1-3.限时、拼团折扣价格存在5位数及以上的情况：现价和券后价整数都缩小至14、小数都缩小至10
      if (this.minPriceLen >= 7) {
        return [14, 10];
      }
      return [18, 12];
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.coupon-price {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;

  .price-line {
    font-size: 14px;
    font-weight: bold;
    display: flex;

    .main-price {
      font-size: 24px;
    }

    .min-price {
      padding: 6px 0px;
      box-sizing: border-box;
      height: 26px;
    }
  }

  .origin {
    opacity: 1;
    font-weight: normal;
    color: $disabled-color;
    font-size: 12px;
    margin-left: 4px;
    height: 18px;
    line-height: 18px;

    .origin-prev {
      margin-right: 5px;
    }

    .origin-price {
      ::v-deep .pl-price-container {
        font-size: 12px;
        font-family: Avenir;
      }
    }

    .custom-origin {
      text-decoration: line-through;
    }
  }
  .activity-line {
    margin-left: 8px;
    display: flex;
    align-items: center;
    padding: 6px 8px;
    box-sizing: border-box;
    height: 26px;
    font-size: 12px;
    border-radius: 13px;
  }
}
</style>
