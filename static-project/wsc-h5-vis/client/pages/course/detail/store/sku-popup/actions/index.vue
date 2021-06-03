<template>
  <div class="sku-actions-box">
    <optimal-coupon v-if="showOptimalCouponTip" />
    <div class="sku-actions">
      <van-button
        v-for="(button, index) in buttons"
        :key="index"
        class="button"
        :url="button.url"
        :color="getColor(index)"
        :style="{ color: getFontColor(index) }"
        square
        @click="handleClick(button.action)"
      >
        {{ button.text }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../../index';
import OptimalCoupon from '../optimal-coupon';

export default {
  components: {
    'van-button': Button,
    OptimalCoupon,
  },

  props: {
    activityType: {
      type: Number,
      default: 0,
    },
    // eslint-disable-next-line vue/require-prop-types
    payload: {
      default: null,
    },
  },

  computed: {
    buttons() {
      return store.state.skuButtonsMap[this.activityType];
    },
    showOptimalCouponTip() {
      return this.activityType === ACTIVITY_TYPE.COUPON;
    },
  },

  methods: {
    handleClick(action) {
      if (!store.state.selectedSku) {
        Toast('请选择规格');
        return;
      }
      if (
        this.activityType === ACTIVITY_TYPE.LADDER_GROUPON &&
        !this.payload &&
        !store.state.selectedGrouponLadder
      ) {
        Toast('请选择拼团类型');
        return;
      }
      action && action(this.payload);
    },

    getColor(index) {
      if (index === this.buttons.length - 1) {
        return this.$theme.colors.main;
      }
      return this.$theme.colors.vice;
    },

    getFontColor(index) {
      if (index === this.buttons.length - 1) {
        return '#fff';
      }
      return this.$theme.colors.main;
    },
  },
};
</script>

<style lang="scss" scoped>
.sku-actions {
  display: flex;
  padding: 4px 16px;

  .button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 0 none;

    &:first-child {
      border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
    }

    &:last-child {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
}
</style>
