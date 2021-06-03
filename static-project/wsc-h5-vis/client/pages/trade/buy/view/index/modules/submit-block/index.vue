<template>
  <van-submit-bar
    v-if="show"
    v-theme="theme"
    class="submit-block"
    :button-text="buttonText"
    :safe-area-inset-bottom="true"
    @submit="onSubmit"
  >
    <div class="submit-block__content">
      <div class="submit-block__price">
        <span class="submit-block__price-label">应付：</span>

        <points-price
          v-if="isPointsExchange"
          v-theme.main
          :points-price="pointsExchange.pointsPrice"
          :points-name="shop.pointsName"
          :price="orderFinalPrice"
        />

        <cap-price v-else v-theme.main :price="orderFinalPrice" />
      </div>

      <order-detail v-if="isShowOrderDetail" />
    </div>
  </van-submit-bar>
</template>

<script>
import { getBillManage } from '@/pages/trade/buy/saas';

import { SubmitBar } from 'vant';
import { Price } from '@youzan/captain';
import PointsPrice from '@/pages/trade/buy/components/points-price';
import OrderDetail from './components/order-detail';

const theme = {
  main: {
    '.van-submit-bar__button': 'background',
  },
};

export default {
  name: 'submit-block',

  components: {
    'van-submit-bar': SubmitBar,
    'cap-price': Price,
    OrderDetail,
    PointsPrice,
  },

  state: ['pay', 'pointsExchange', 'shop', 'isShopRest'],

  getters: [
    'orderOriginPrice',
    'orderFinalPrice',
    'isOrderCreated',
    'isPointsExchange',
  ],

  computed: {
    theme() {
      return theme;
    },

    buttonText() {
      return this.orderOriginPrice === 0 ? '免费报名' : '提交订单';
    },

    // 0元单 & 积分商城不展示明细
    isShowOrderDetail() {
      if (this.orderOriginPrice === 0 || this.isPointsExchange) {
        return false;
      }
      return true;
    },
    show() {
      if (this.isShopRest) {
        return false;
      }
      return true;
    },
  },

  mounted() {
    document.body.style.marginBottom = '50px';
  },

  beforeDestroy() {
    if (document.body.style.marginBottom === '50px') {
      document.body.style.marginBottom = 'auto';
    }
  },

  methods: {
    onSubmit() {
      const billManage = getBillManage();

      if (!this.isOrderCreated) {
        billManage.submitOrder().then(() => {
          billManage.startPay();
        });
      } else {
        billManage.startPay();
      }
    },
  },
};
</script>

<style lang="scss" scope>
@import 'mixins/index.scss';

.submit-block {
  box-shadow: 0 -2px 10px 0 rgba(125, 126, 128, 0.16);

  &__content {
    flex: 1;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    display: flex;
    align-items: center;
  }

  &__price-label {
    flex: 0 0 auto;
  }

  .cap-price__integer {
    font-size: 20px;
  }

  .points-price {
    font-size: 20px;
  }
}
</style>
