<template>
  <div class="good-action">
    <van-goods-action>
      <van-goods-action-big-btn
        v-if="collectPraiseNum"
        class="goods-action__promotion vice-btn"
        @click="onCreatePraise"
      >
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
        v-else-if="+price === 0"
        class="main-btn"
        primary
        @click="onClickToBuy()"
      >
        <div class="goods-action__price">
          免费领取
        </div>
      </van-goods-action-big-btn>
    </van-goods-action>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton } from 'vant';

export default {
  name: 'goods-action-weapp',

  components: {
    'van-goods-action': GoodsAction,
    'van-goods-action-big-btn': GoodsActionButton,
  },

  props: {
    price: {
      type: [Number, String],
      default: 0,
    },
    // 是否参加好友助力活动
    collectPraiseNum: {
      type: Number,
      default: 0,
    },

    // 好友助力类型 0：免费听课，1：领取优惠券
    prizeChannel: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    onClickToBuy(type) {
      event.preventDefault();
      this.$emit('pay', type);
    },

    // 创建点赞活动
    onCreatePraise() {
      event.preventDefault();
      this.$emit('create-praise');
    },
  },
};
</script>

<style lang="scss">
  .goods-action {
    &__promotion {
      &-price {
        display: block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        margin-top: 1px;

        .vis-price-label__item {
          line-height: 22px;
        }
      }

      &-label {
        display: block;
        height: 18px;
        line-height: 16px;
        font-size: 12px;

        &--opacity {
          opacity: 0.6;

          & * {
            line-height: 10px;
            font-size: 10px;
          }
        }
      }
    }
  }
</style>
