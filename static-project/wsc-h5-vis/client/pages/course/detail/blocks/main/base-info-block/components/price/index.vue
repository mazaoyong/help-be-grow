<template>
  <div v-if="show" class="price">
    <div>
      <div>
        <current-price
          :price="currentPrice"
          :turn-free="isRangePrice ? false : true"
          :active-color="mainColor"
          :font-size="goodsData.sku.maxPrice ? 20 : 16"
          bold
          no-split
        />
        <mini-font-tag
          v-if="activityData.priceTag"
          class="mini-price-tag"
          height="16px"
          :text="activityData.priceTag"
          :background-color="tagBg"
          :color="mainColor"
        />
      </div>
      <div v-if="showPoints" class="points-price">
        兑换价：
        <points
          :min="activityData.sku.minPoint"
          :max="activityData.sku.maxPoint"
        />
      </div>
      <div class="origin">
        <span v-if="hasActivityPrice">
          <span class="origin-prev">价格</span>
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
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';
import { fns } from '@youzan/vue-theme-plugin';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import MiniFontTag from '@/components/mini-font-tag';
import Points from '@/components/points';

const { CurrentPrice, OldPrice } = PriceLabel;

export default {
  components: {
    MiniFontTag,
    CurrentPrice,
    OldPrice,
    Points,
  },

  rootState: ['goodsData', 'activityTypes', 'activityData', 'env'],
  rootGetters: ['isOnlineCourse', 'showUmpBlock'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      if (this.showUmpBlock) {
        return false;
      }
      return true;
    },

    showPoints() {
      if (this.activityTypes.includes(ACTIVITY_TYPE.POINTS_EXCHANGE)) {
        return true;
      }
      return false;
    },

    hasActivityPrice() {
      const { sku } = this.activityData;
      return sku && Number.isInteger(sku.minPrice) && Number.isInteger(sku.maxPrice);
    },

    currentPrice() {
      if (this.hasActivityPrice) {
        return [this.activityData.sku.minPrice, this.activityData.sku.maxPrice];
      }
      return this.goodsPrice;
    },

    goodsPrice() {
      return [this.goodsData.sku.minPrice, this.goodsData.sku.maxPrice];
    },

    isRangePrice() {
      if (this.hasActivityPrice) {
        return !(this.activityData.sku.minPrice === this.activityData.sku.maxPrice);
      } else {
        return !(this.minPrice === this.maxPrice);
      }
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    tagBg() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 12px;

  .mini-price-tag {
    position: relative;
    top: -2px;
    padding: 0 4px;
    margin-left: 4px;
  }

  .points-price {
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 18px;
    color: $disabled-color;
  }
}

.origin {
  margin-top: 4px;
  font-size: 12px;
  color: $disabled-color;

  .origin-prev {
    margin-right: 5px;
  }

  .origin-price {
    ::v-deep .pl-price-container {
      font-size: 12px;
    }
  }

  .custom-origin {
    text-decoration: line-through;
  }
}
</style>
