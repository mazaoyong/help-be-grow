<template>
  <div class="paid-content__coupon">
    <van-coupon-cell
      :coupons="couponList"
      :chosen-coupon="chosenCoupon"
      @click="showPop"
    />

    <van-popup
      v-model="showList"
      class="paid-content__coupon--popup"
      position="bottom"
      :overlay="false">
      <van-coupon-list
        :coupons="couponList"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCouponList"
        @change="onChangeChosenCoupon"
        @exchange="onExchangeCoupon"
      />
    </van-popup>

    <!-- <cap-order-coupon
      :chosen-coupon="chosenCoupon"
      :coupon-list="couponList"
      :disabled-coupon-list="disabledCouponList"
      @change="onChangeChosenCoupon"
      @exchange="onExchangeCoupon"
    /> -->
  </div>
</template>

<script>
/* import { CouponCell, CouponList, Popup } from 'vant'; */
import { CouponCell, Popup } from 'vant';
// import { OrderCoupon } from 'captain-ui';
import CouponList from './coupon-components/coupon-list';

export default {
  name: 'coupon',

  components: {
    'van-coupon-cell': CouponCell,
    'van-coupon-list': CouponList,
    'van-popup': Popup,
    // 'cap-order-coupon': OrderCoupon
  },

  props: {
    couponList: {
      type: Array,
      default: () => [],
    },

    disabledCouponList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      showList: false,
      chosenCoupon: 0,
    };
  },

  methods: {
    showPop() {
      this.showList = true;
    },

    onChangeChosenCoupon(index) {
      this.showList = false;
      this.chosenCoupon = index;
      this.$emit('change', index);
    },

    onExchangeCoupon(code) {
      this.$emit('exchange', code);
    },
  },
};
</script>

<style lang="scss">
  .paid-content__coupon {
    .van-cell__left-icon, .van-cell__right-icon {
      font-size: 10px;
    }

    &--popup {
      top: 0;
      background-color: #f8f8f8;

      .van-coupon-list__top {
        position: absolute !important;
      }

      .van-coupon-list__filed {
        margin: 10px 0;
        padding: 4px 10px 4px 25px;
      }

      .van-coupon-list__exchange {
        position: absolute;
      }
    }

    .van-cell__value {
      padding-right: 0;
    }
  }
</style>
