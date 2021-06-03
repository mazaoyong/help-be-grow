<template>
  <div
    v-tab="tab"
    class="base-info-block"
  >
    <component
      :is="hasCouponActivity ?'coupon-price': 'price'"
      v-if="showPrice"
    />
    <fans-benefit />
    <wecom-fans-benefit />
    <info />
  </div>
</template>

<script>
import Price from './components/price';
import CouponPrice from './components/coupon-price';
import Info from './components/info';
import FansBenefit from './components/fans-benefit';
import WecomFansBenefit from './components/wecom-fans-benefit';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export default {
  components: {
    Price,
    Info,
    FansBenefit,
    CouponPrice,
    WecomFansBenefit,
  },
  rootState: ['activityTypes', 'goodsData', 'env'],
  rootGetters: ['isColumn', 'isOnlineCourse', 'showUmpBlock'],

  computed: {
    showPrice() {
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
    hasCouponActivity() {
      if (Array.isArray(this.activityTypes)) {
        return this.activityTypes.includes(ACTIVITY_TYPE.COUPON);
      }
      return false;
    },
    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.base-info-block {
  position: relative;
  padding: 16px;
  margin-bottom: 8px;
  background-color: $white;
}
</style>
