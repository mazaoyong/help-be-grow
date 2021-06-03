<template>
  <div class="self-acticity-bar">
    <common-activity-bar v-bind="_props">
      <template
        v-if="hasCouponActivity"
        slot="header"
      >
        <div class="price-box gradient-new-bg main-text">
          <i class="lines-bg activity-main-lines-bg" />

          <div class="price-line">
            <self-price-label
              class="min-price"
              :suffix="isActivityRangePrice ? '起': ''"
              :price="minPrice"
              :price-font-size="currentPriceSizes[0]"
              :text-font-size="currentPriceSizes[1]"
              :font-color="'#FFF'"
              :is-price-bold="false"
            />
            <self-price-label
              class="activity-line"
              :prefix="tag"
              :suffix="isCouponRangePrice ? '起': ''"
              :price="minCouponPrice"
              :price-font-size="couponPricefontSizes[0]"
              :text-font-size="couponPricefontSizes[1]"
              :font-color="activityTagFontColor"
              :back-color="activityTagBgColor"
            />
          </div>

          <div
            class="other-line"
            :style="{ color: mainTextColor }"
          >
            <span class="old-prev">原价</span>
            <vis-price-old
              class="origin"
              :price="isRangeOrigin ? [minOrigin, maxOrigin] : minOrigin"
              currency="￥"
              :disable-color="mainTextColor"
            />
          </div>
        </div>
      </template>
    </common-activity-bar>
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';
import CoustomPriceLabel from '@/pages/course/detail/components/price-label';
import CommonActivityBar from '@/components/activity-bar';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { get } from 'lodash';

const { OldPrice } = PriceLabel;

export default {
  name: 'activity-bar',

  components: {
    'vis-price-old': OldPrice,
    'self-price-label': CoustomPriceLabel,
    'common-activity-bar': CommonActivityBar,
  },

  rootState: ['activityTypes', 'activityData'],

  props: {
    ...CommonActivityBar.props,
    minCouponPrice: {
      type: Number,
      default: null,
    },
  },

  computed: {
    hasCouponActivity() {
      if (Array.isArray(this.activityTypes)) {
        return this.activityTypes.includes(ACTIVITY_TYPE.COUPON);
      }
      return false;
    },

    isRangeOrigin() {
      return this.minOrigin !== this.maxOrigin;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    mainTextColor() {
      return this.$theme.colors.mainText;
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
    activityTagBgColor() {
      return '#FFF';
    },
    activityTagFontColor() {
      return this.mainColor;
    },
    isActivityRangePrice() {
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
  },
};
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/theme/global-theme/light-green-theme/index.scss';
@import 'mixins/index.scss';

.self-acticity-bar {
}

.price-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 16px;

  i.lines-bg {
    position: absolute;
    top: 0;
    left: 60px;
    width: 172px;
    height: 100%;
    background-position: 0 -180px;
    transform: rotate(180deg);
  }

  .price-line {
    // align-items: center;
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
    .origin {
      margin-left: 4px;
      text-decoration: line-through;
      opacity: 0.7;
      font-weight: normal;
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
  .other-line {
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    opacity: 0.7;

    .old-prev {
      font-size: 12px;
    }

    .origin {
      text-decoration: line-through;
      ::v-deep .pl-price-container {
        font-family: Avenir;
      }
    }
  }
}
</style>
