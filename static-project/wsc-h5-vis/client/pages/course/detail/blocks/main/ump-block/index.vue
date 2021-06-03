<template>
  <activity-bar
    v-if="show"
    :min-price="activityData.sku.minPrice"
    :max-price="activityData.sku.maxPrice"
    :min-coupon-price="activityData.sku.minCouponPrice"
    :min-origin="origin.min"
    :max-origin="origin.max"
    :tag="activityData.priceTag"
    :start-time="activityData.startTime"
    :end-time="activityData.endTime"
    :total-stock="activityData.sku.originStock"
    :left-stock="activityData.sku.stockNum"
  />
</template>

<script>
import ActivityBar from './components/activity-bar';

export default {
  components: {
    ActivityBar,
  },

  rootState: ['goodsData', 'activityData', 'env'],
  rootGetters: ['showUmpBlock', 'isOnlineCourse'],
  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      return this.showUmpBlock;
    },

    origin() {
      const oldPriceList = [];
      if (this.goodsData.sku.hasSku) {
        Object.keys(this.activityData.sku.map).forEach((skuId) => {
          this.goodsData.sku.list.forEach((sku) => {
            if (+skuId === sku.id) {
              oldPriceList.push(sku.price);
            }
          });
        });
      } else {
        oldPriceList.push(this.goodsData.sku.minPrice);
      }
      return {
        min: Math.min(...oldPriceList),
        max: Math.max(...oldPriceList),
      };
    },
  },
};
</script>
