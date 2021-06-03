<template>
  <div class="collect-button buy-btn">
    <van-goods-action-big-btn class="goods-action__promotion vice-btn" @click="onCreatePraise">
      <slot>
        <span class="goods-action__promotion-price">
          {{ prizeChannel ? '领取优惠券': '免费听课' }}
        </span>
        <span class="goods-action__promotion-label">
          {{ collectPraiseNum }}个好友助力
        </span>
      </slot>
    </van-goods-action-big-btn>
    <van-goods-action-big-btn
      class="goods-action__promotion main-btn"
      primary
      @click="onClickToBuy(0, $event)"
    >
      <slot>
        <span class="goods-action__promotion-price">
          <current-price :price="price" active-color="#fff" />
        </span>
        <span class="goods-action__promotion-label">
          {{ isVipDiscount ? '会员价' : (isColumn ? '购买专栏' : '购买内容') }}
        </span>
      </slot>
    </van-goods-action-big-btn>
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';
import { GoodsActionButton } from 'vant';
const { CurrentPrice } = PriceLabel;

export default {
  name: 'collect-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
    CurrentPrice,
  },

  props: {
    price: [Number, String],
    collectPraiseNum: Number,
    isColumn: Boolean,
    originPrice: [Number, String],
    isVipDiscount: Boolean,
    prizeChannel: Number,
  },

  methods: {
    onClickToBuy(type, event) {
      this.$emit('onClickToBuy', type, event);
    },

    onCreatePraise() {
      this.$emit('onCreatePraise');
    },
  },
};
</script>
