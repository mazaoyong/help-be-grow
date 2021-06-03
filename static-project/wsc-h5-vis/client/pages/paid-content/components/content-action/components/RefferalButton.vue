<template>
  <div class="refferal-button buy-btn">
    <van-goods-action-big-btn
      v-if="!showBuyBtn || isFreeTry"
      class="main-btn"
      primary
      @click.native="onColumnBtnClick">
      查看专栏
    </van-goods-action-big-btn>

    <van-goods-action-big-btn
      v-else
      class="main-btn"
      :class="refferalClass"
      primary
      @click="onClickToBuy(0, $event)">
      <slot>
        <span class="goods-action__promotion-price">
          新客专享 <current-price :price="newPrice" active-color="#fff" />
        </span>
        <span class="goods-action__promotion-label goods-action__promotion-label--opacity">
          原价 <old-price :price="price" disable-color="#fff" />
        </span>
      </slot>
    </van-goods-action-big-btn>
  </div>
</template>

<script>
import { GoodsActionButton } from 'vant';
// import { parsePrice } from 'pct/utils';
import { SELLER_TYPE } from 'pct/constants';
import { PriceLabel } from '@youzan/vis-ui';
const { CurrentPrice, OldPrice } = PriceLabel;

export default {
  name: 'refferal-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
    CurrentPrice,
    OldPrice,
  },

  props: {
    price: [Number, String],

    showBuyBtn: Boolean,

    isFreeTry: Boolean,

    sellerType: Number,

    columnUrl: String,

    // 新人立减价格
    newerSubsidyPrice: Number,
  },

  computed: {
    newPrice() {
      const newPrice = this.price - this.newerSubsidyPrice;
      return newPrice;
    },

    refferalClass() {
      if (this.sellerType === SELLER_TYPE.BOTH) {
        return 'goods-action__promotion';
      } else {
        return 'refferal-line';
      }
    },
  },

  methods: {
    onClickToBuy(type, event) {
      this.$emit('onClickToBuy', type, event);
    },
    onColumnBtnClick() {
      window.location.hash = this.columnUrl;
      window.location.reload();
    },
  },
};
</script>

<style lang="scss">
.refferal-button {
  .goods-action__promotion {
    padding-top: 0;
  }

  &__new {
    display: block;
    height: 18px;
    line-height: 1;
    margin-bottom: 5px;
    font-size: 16px;
  }

  &__origin {
    display: block;
    height: 16px;
    line-height: 1;
    font-size: 12px;
    color: rgba(255, 255, 255, .7);
    text-decoration: line-through;
  }

  .refferal-line {
    .refferal-button__origin {
      display: initial;
    }

    .refferal-button__new {
      display: initial;
      margin-right: 10px;
    }
  }
}
</style>
