<template>
  <div
    v-if="!!currentOptimalCoupon"
    class="optimal-coupon"
  >
    <div class="title">
      <span>当前商品可使用 </span>
      <span v-theme:color.main>{{ discountPrice }}
      </span><span> 券</span>
    </div>
  </div>
</template>

<script>
import { get, keyBy } from 'lodash';
import store from '../../index';

export default {
  computed: {
    skuOptimalCouponMap() {
      const skuPreferenceList = get(
        store.state.activityData,
        'coupon.skuPreferenceList',
        [],
      );
      const skuCouponMap = keyBy(skuPreferenceList, 'skuId');
      return skuCouponMap;
    },
    currentOptimalCoupon() {
      const { selectedSku } = store.state;
      if (!selectedSku) return null;
      const { id } = selectedSku;
      if (!id) return null;
      const curOptimalCoupon = this.skuOptimalCouponMap[id];
      if (!curOptimalCoupon) return null;
      return curOptimalCoupon;
    },
    discountPrice() {
      const { useThresholdAndValueCopywriting } = this.currentOptimalCoupon;
      return useThresholdAndValueCopywriting;
    },
  },
};
</script>

<style scoped lang="scss">
@import 'mixins/index.scss';

.optimal-coupon {
  display: flex;
  justify-content: center;
  margin-bottom: 11px;

  .title {
    color: $disabled-color;
    font-size: 12px;
  }
}
</style>
