<template>
  <div class="fission-wrap" @click="handleFissionClick">
    <FissionCoupon v-if="orderCouponInfo" :num="orderCouponInfo.quantity" />
  </div>
</template>

<script>
import FissionCoupon from '@/domain/payment/components/ump-fission-coupon';
import { mapData } from '@youzan/ranta-helper-vue';
import Args from 'zan-utils/url/args';

const kdtId = _global.kdtId || _global.kdt_id;

export default {
  components: {
    FissionCoupon,
  },
  data() {
    return {
      orderCouponInfo: null,
      orderNo: '',
    };
  },
  computed: {
    fissionCouponUrl() {
      const url = Args.add('/wscump/fission/share', {
        kdtId,
        orderNo: this.orderNo,
        fissionId: this.orderCouponInfo.id,
      });
      return url;
    },
  },
  created() {
    mapData(this, ['orderCouponInfo', 'orderNo']);
  },
  methods: {
    handleFissionClick() {
      this.ctx.process.invoke('navigateGo', {
        url: this.fissionCouponUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fission-wrap {
  margin: 12px;
}
</style>
