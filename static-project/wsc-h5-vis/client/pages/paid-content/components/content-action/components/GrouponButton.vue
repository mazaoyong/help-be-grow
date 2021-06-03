<template>
  <div class="groupon-button buy-btn">
    <template v-if="!isJoined">
      <van-goods-action-big-btn
        v-for="(item, index) in grouponBtns"
        :key="index"
        :class="item.class"
        @click="onClick(item.type, $event)"
      >
        <slot>
          <span class="goods-action__promotion-price">
            <current-price :price="item.price" />
          </span>
          <span class="goods-action__promotion-label">
            {{ item.label }}
          </span>
        </slot>
      </van-goods-action-big-btn>
    </template>

    <!-- 有活动，且已参加拼团 -->
    <van-goods-action-big-btn
      v-else
      class="main-btn"
      primary
      @click.native="onMyClick"
    >
      查看我的团
    </van-goods-action-big-btn>
  </div>
</template>

<script>
import { GoodsActionButton } from 'vant';
import { GROUPON_LABEL } from 'pct/constants';
import { PriceLabel } from '@youzan/vis-ui';
import { redirect } from '@/common/utils/custom-safe-link';
import ladderSelect from './ladder-select';
const { CurrentPrice } = PriceLabel;

export default {
  name: 'groupon-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
    CurrentPrice,
  },

  props: {
    price: [Number, String],

    isJoined: [Boolean, Number],

    promotionButtonInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    grouponBtns() {
      return this.parseGrouponBtns();
    },
  },

  methods: {
    parseGrouponBtns() {
      const grouponBtn = [
        {
          price: this.price,
          label: GROUPON_LABEL.ORIGIN,
          type: 0,
          class: 'goods-action__promotion vice-btn',
        },
        {
          price: this.promotionButtonInfo.price,
          label: GROUPON_LABEL.GROUPON,
          type: 1,
          class: 'goods-action__promotion main-btn',
        },
      ];
      return grouponBtn;
    },

    onClick(type, event) {
      if (this.promotionButtonInfo.groupType === 2 && type === 1) {
        ladderSelect({
          ladderPrice: this.promotionButtonInfo.ladderPrice,
          minPrice: this.promotionButtonInfo.minPrice,
          maxPrice: this.promotionButtonInfo.maxPrice,
          cover: this.promotionButtonInfo.cover,
        }).then(scale => {
          this.$emit('onClickToBuy', type, event, scale);
        });
      } else {
        this.$emit('onClickToBuy', type, event);
      }
    },

    onMyClick() {
      if (this.promotionButtonInfo.userGroupAlias) {
        redirect({
          url: '/wscvis/ump/groupon/groupon-detail',
          query: {
            group_alias: this.promotionButtonInfo.userGroupAlias,
            activity_type: this.promotionButtonInfo.promotionType,
            alias: this.promotionButtonInfo.alias,
          },
        });
      }
    },
  },
};
</script>
