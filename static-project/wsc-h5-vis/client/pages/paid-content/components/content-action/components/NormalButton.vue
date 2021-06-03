<template>
  <div class="normal-button buy-btn">
    <template v-if="!showBuyBtn || isFreeTry">
      <van-goods-action-big-btn
        v-if="+buyPrice === 0"
        class="main-btn"
        primary
        @click="onClickToBuy"
      >
        领取专栏
      </van-goods-action-big-btn>
      <van-goods-action-big-btn
        v-else
        class="main-btn"
        primary
        @click.native="onColumnBtnClick"
      >
        查看专栏
      </van-goods-action-big-btn>
    </template>

    <template v-else>
      <van-goods-action-big-btn
        v-if="showColumnBtn"
        class="goods-action__promotion vice-btn no-padding"
        @click.native="onColumnBtnClick"
      >
        查看专栏
      </van-goods-action-big-btn>

      <van-goods-action-big-btn
        v-if="+buyPrice === 0"
        class="main-btn"
        primary
        @click="onClickToBuy($event)"
      >
        <div class="goods-action__price">
          免费领取
        </div>
      </van-goods-action-big-btn>
      <van-goods-action-big-btn
        v-else
        class="main-btn"
        primary
        @click="onClickToBuy"
      >
        <div class="goods-action__price">
          {{ pricePrefixLabel }}
        </div>
      </van-goods-action-big-btn>
    </template>
  </div>
</template>

<script>
import { GoodsActionButton } from 'vant';
import { SELLER_TYPE } from 'pct/constants';

export default {
  name: 'normal-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
  },

  props: {
    price: [Number, String],
    originPrice: [Number, String],
    // 划线价
    origin: [Number, String],
    // 内容所属专栏价格
    columnPrice: [Number, String],
    showBuyBtn: Boolean,
    isFreeTry: Boolean,
    isColumn: Boolean,
    columnUrl: String,
    isVipDiscount: Boolean,
    sellerType: Number,
    timelimitedDiscountInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  computed: {
    showColumnBtn() {
      return this.sellerType === SELLER_TYPE.BOTH && !this.isFreeTry && !this.isVipDiscount;
    },

    pricePrefixLabel() {
      // ！是否是时尚芭莎店铺，过期可删除 ！
      // https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=47630
      const isShopBaSha = +_global.kdt_id === 44691741;
      if (this.timelimitedDiscountInfo.isStarted) {
        return '立即抢课';
      } else {
        return this.isColumn ? '购买专栏' : isShopBaSha ? '购买观众票' : '购买内容';
      }
    },

    buyPrice() {
      if (this.timelimitedDiscountInfo.isStarted) {
        return this.timelimitedDiscountInfo.min;
      }
      return this.price;
    },
  },

  methods: {
    onClickToBuy(event) {
      const type = this.timelimitedDiscountInfo.isStarted ? 3 : 0;
      this.$emit('onClickToBuy', type, event);
    },
    onColumnBtnClick() {
      window.location.hash = this.columnUrl;
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.no-padding {
  padding: 0 !important;
}
.goods-action__price {
  line-height: 1;
}
.goods-action__origin {
  display: block;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  transform: scale(0.833333);
  text-decoration: line-through;
}
</style>
