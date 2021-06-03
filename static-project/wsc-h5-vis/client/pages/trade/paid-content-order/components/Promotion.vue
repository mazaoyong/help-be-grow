<template>
  <div class="promotion-banner">
    <vis-label show-arrow>
      <span slot="left-content" class="promotion-banner__text">
        店铺活动
      </span>
      <template
        v-for="(promotion, $index) in promotionInfo"
        slot="right-content"
      >
        <span
          :key="$index"
          class="promotion-banner__tip"
          @click="onShowPromotionPop($index)"
        >
          {{ promotion.descriptions }}
        </span>
      </template>
    </vis-label>

    <promotion-pop
      v-model="isShowPromotionPop"
      :promotion-info="promotionInfo"
    />
  </div>
</template>

<script>
import Label from '../../../edu/components/label';
import PromotionPop from '../../../edu/order-confirm/container/promotion-info/components/PromotionPop';

export default {
  name: 'promotion-section',

  components: {
    PromotionPop,
    'vis-label': Label,
  },

  props: {
    promotionInfo: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isShowPromotionPop: false,
    };
  },

  methods: {
    onShowPromotionPop(index) {
      if (this.promotionInfo.length > 0 && this.promotionInfo[index].presentGoodsList.length > 0) {
        this.isShowPromotionPop = true;
      }
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import "var";

  .promotion-banner {

    .vis-label {
      &-left {
        padding-left: 15px;
      }
    }

    &__text {
      font-size: 14px;
      color: #333;
    }

    &__tip {
      display: inline-block;
      width: 100%;
      padding-right: 30px;
      font-size: 14px;
      color: #999;
      text-align: right;

      @include multi-ellipsis(1);
    }

    .van-cell {
      .van-cell__value--alone {
        @include multi-ellipsis(1);
      }
    }
    &.pr-info-ellipsis {
      @include multi-ellipsis(1);
    }
  }
</style>
