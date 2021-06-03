<template>
  <div>
    <card-cell
      v-log:click="{
        ei: 'edu_click_btn',
        en: '教育下单点击页面按钮',
        pt: 'trade',
        params: {
          btn_name: 'edu_coupon_cell'
        }
      }"
      class="coupon-cell"
      title="优惠券"
      :icon="icon"
      tip="暂无可用"
      :value="value"
      :is-editable="!isOrderCreated"
      @click="onClickCell"
      @click-icon.stop="onClickIcon"
    />
    <coupon-list v-model="isShowCouponList" />
  </div>
</template>

<script>
import formatMoney from '@youzan/utils/money/format';

import { Toast } from 'vant';
import { CardCell } from '@/pages/trade/buy/components/card';
import CouponList from '../coupon-list';
import { openCouponTipsPopup } from '../coupon-tips';

export default {
  name: 'coupon-cell',

  components: {
    CardCell,
    CouponList,
  },

  state: ['coupon', 'pay', 'shop'],

  getters: ['chosenCoupon', 'isOrderCreated', 'couponDecrease'],

  data() {
    return {
      isShowCouponList: false,
    };
  },

  computed: {
    value() {
      const { list } = this.coupon;

      if (this.chosenCoupon.id) {
        return `-￥${formatMoney(this.chosenCoupon.value)}`;
      } else {
        const length = list.length;
        return length > 0 ? `${length}张可用` : '';
      }
    },

    // 仅当优惠券优惠价格 > 商品价格展示icon
    icon() {
      if (this.chosenCoupon.denominations > this.pay.realPay) {
        return 'info-o';
      }

      return '';
    },
  },

  methods: {
    onClickCell() {
      this.isShowCouponList = true;
    },

    onClickIcon() {
      if (this.isOrderCreated) {
        return Toast('提交订单不能再选择优惠卷');
      }

      openCouponTipsPopup();
    },
  },
};
</script>
