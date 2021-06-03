<template>
  <div class="groupon-intro">
    <van-cell-group :border="false">
      <van-cell
        class="groupon-intro__cell"
        is-link
        @click="onActionClick"
      >
        <template slot="title">
          <span class="groupon-intro__cell-tag">
            玩法
          </span>
          <span class="groupon-intro__cell-text">{{ grouponTips }}</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import format from '@youzan/utils/money/format';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'groupon-intro',

  components: {
    'van-cell': Cell,
    'van-cell-group': CellGroup,
  },

  props: {
    activityNum: [Number, String],
    /*
      * 拼团类型：0->普通拼团；1->老带新
      */
    groupType: Number,
    isGoing: {
      type: Boolean,
      default: false,
    },
    ladderPrice: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    introStatus() {
      return this.groupType === 1 ? '' : (this.isGoing ? '玩法' : '拼团');
    },
    grouponTips() {
      if (this.groupType === 2) {
        const ladderList = Object.keys(this.ladderPrice).map(ladder => {
          let minPrice = this.ladderPrice[ladder][0].skuPrice;
          let maxPrice = 0;
          this.ladderPrice[ladder].forEach(sku => {
            if (sku.skuPrice < minPrice) {
              minPrice = sku.skuPrice;
            }
            if (sku.skuPrice > maxPrice) {
              maxPrice = sku.skuPrice;
            }
          });
          if (minPrice === maxPrice) {
            return `${ladder}人拼团${format(minPrice, true, false)}/件`;
          }
          return `${ladder}人拼团${format(minPrice, true, false)}起/件`;
        });
        return `${ladderList.join('，')}，开团前选择参团人数，支付后开团并邀请好友参团，人数不足自动退款`;
      }
      return `支付开团邀请${+this.activityNum - 1}${this.groupType === 1 ? '名新用户' : '人'}参团，人数不足自动退款`;
    },
  },

  methods: {
    onActionClick() {
      SafeLink.redirect({
        url: 'https://h5.youzan.com/v2/ump/groupon/guide',
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

.groupon-intro {
  width: 100%;

  &__cell {
    font-size: 13px;

    &-tag {
      color: #969799;
      margin-right: 15px;
      display: inline-block;
      width: 26px;
      flex: 0 0 auto;
    }

    &-text {
      @include multi-ellipsis(3);

      color: #323233;
    }

    .van-cell__value {
      flex: initial;
      color: $c-gray-dark;
    }

    .van-cell__title {
      display: flex;
    }

    .van-cell__right-icon {
      align-self: center;
    }
  }

  &__oldtonew {
    padding-bottom: 0;

    &-info {
      /* text-align: center; */

      @include ellipsis;
    }

    &-logo {
      /* margin-left: -5px; */
      margin-right: 5px;
      font-size: 13px;
      color: #00b389;
      background-color: rgba(0, 179, 137, .1);
      padding: 3px 4px;
      border-radius: 12px;
    }

    &-tip {
      font-size: 12px;
      color: $c-gray-silver;
    }
  }

  .van-cell:after {
    border: 0;
  }
}
</style>
