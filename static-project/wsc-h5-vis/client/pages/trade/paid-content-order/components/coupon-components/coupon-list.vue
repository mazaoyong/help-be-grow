<template>
  <div class="van-coupon-list">
    <cell-group v-if="showExchangeBar" class="van-coupon-list__top">
      <field
        v-model="currentCode"
        class="van-coupon-list__filed van-hairline--surround"
        placeholder="请输入优惠码"
        :maxlength="20"
      />
      <van-button
        size="small"
        type="danger"
        class="van-coupon-list__exchange"
        text="兑换"
        :loading="exchangeButtonLoading"
        :disabled="buttonDisabled"
        @click="onClickExchangeButton"
      />
    </cell-group>
    <div
      ref="list"
      class="van-coupon-list__list"
      :class="{ 'van-coupon-list--with-exchange': showExchangeBar }">
      <coupon-item
        v-for="(item, index) in coupons"
        ref="card"
        :key="item.id || item.name"
        :data="item"
        :chosen="index === chosenCoupon"
        @click.native="$emit('change', index)"
      />
      <h3 v-if="disabledCoupons.length" class="van-coupon-list__invalid-title">
        不可用优惠
      </h3>
      <coupon-item
        v-for="item in disabledCoupons"
        :key="item.id || item.name"
        disabled
        :data="item"
      />
      <div v-if="!coupons.length && !disabledCoupons.length" class="van-coupon-list__empty">
        <img src="https://b.yzcdn.cn/v2/image/wap/trade/new_order/empty@2x.png">
        <p>暂无优惠券</p>
      </div>
    </div>
    <div
      v-show="showCloseButton"
      class="van-coupon-list__close van-hairline--top"
      @click="$emit('change', -1)">
      不使用优惠
    </div>
  </div>
</template>

<script>
import { CellGroup, Field, Button } from 'vant';
import CouponItem from './coupon-item';

export default {
  name: 'van-coupon-list',

  components: {
    'van-button': Button,
    CellGroup,
    Field,
    CouponItem,
  },

  model: {
    prop: 'code',
  },

  props: {
    code: String,
    disabledListTitle: String,
    exchangeButtonText: String,
    exchangeButtonLoading: Boolean,
    exchangeButtonDisabled: Boolean,
    exchangeMinLength: {
      type: Number,
      default: 1,
    },
    chosenCoupon: {
      type: Number,
      default: -1,
    },
    coupons: {
      type: Array,
      default: () => [],
    },
    disabledCoupons: {
      type: Array,
      default: () => [],
    },
    displayedCouponIndex: {
      type: Number,
      default: -1,
    },
    showExchangeBar: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      currentCode: this.code || '',
    };
  },

  computed: {
    buttonDisabled() {
      return (
        !this.exchangeButtonLoading &&
        (this.exchangeButtonDisabled ||
          this.currentCode.length < this.exchangeMinLength)
      );
    },
  },

  watch: {
    code(code) {
      this.currentCode = code;
    },

    currentCode(code) {
      this.$emit('input', code);
    },

    displayedCouponIndex(val) {
      this.scrollToShowCoupon(val);
    },
  },

  mounted() {
    this.scrollToShowCoupon(this.displayedCouponIndex);
  },

  methods: {
    onClickExchangeButton() {
      this.$emit('exchange', this.currentCode);

      // auto clear currentCode when not use v-model
      if (!this.code) {
        this.currentCode = '';
      }
    },

    // scroll to show specific coupon
    scrollToShowCoupon(index) {
      if (index === -1) {
        return;
      }

      this.$nextTick(() => {
        const { card, list } = this.$refs;

        if (list && card && card[index]) {
          list.scrollTop = card[index].$el.offsetTop - 100;
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .van-coupon-list__invalid-title {
    margin-top: 30px !important;
  }

  .van-coupon-list__filed .van-cell__value {
    padding-left: 0;
    transform: scaleX(1);
  }

  .van-coupon-list__filed {

    &.van-cell {

      &:after {
        content: '';
        top: 0;
        left: 0;
        height: 200%;
        -webkit-perspective: 1000;
        -webkit-backface-visibility: hidden;
        pointer-events: none;
        border-bottom: 1px solid #e5e5e5;
        box-sizing: border-box;
        position: absolute;
        transform-origin: left top;
      }

      &:not(:last-child):after {
        left: 15px;
        right: 0;
        width: auto;
        transform: scaleY(.5);
        border-bottom-width: 1px;
      }
    }
  }

  .van-coupon-list__top {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;
    padding-right: 85px;
    box-sizing: border-box;
  }

  .van-button--disabled {
    color: #999;
    background-color: #e5e5e5;
    border: 1px solid #cacaca;
  }

  .van-coupon-list__list {
    height: 100%;
    overflow-y: auto;
    padding: 15px 0 60px;
    box-sizing: border-box;

    h3 {
      color: #999;
      margin: 15px 0;
      font-size: 14px;
      font-weight: 400;
      position: relative;
      text-align: center;
    }
  }

  .van-coupon-list__empty {
    text-align: center;

    img {
      width: 80px;
      height: 84px;
      display: block;
      margin: 10px auto;
    }
  }

  .van-coupon-list__close {
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 15px;
    line-height: 45px;
    text-align: center;
    position: absolute;
    background-color: #fff;
  }

  .van-coupon-list {
    padding: 0 15px;

    &--with-exchange {
      padding-top: 70px;
    }

    &__exchange {
      top: 10px;
      right: 15px;
    }
  }
</style>
