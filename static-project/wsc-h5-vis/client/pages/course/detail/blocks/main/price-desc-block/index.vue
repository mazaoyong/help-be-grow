<template>
  <van-collapse
    v-if="show"
    v-model="active"
    v-tab="tab"
    :border="false"
  >
    <van-collapse-item
      class="price-desc-block"
      name="priceDesc"
      :is-link="false"
      :border="false"
    >
      <van-divider slot="title" class="divider">
        <span class="divider-title">价格说明</span>
        <van-icon class="divider-icon" :class="open && 'open'" name="arrow" />
      </van-divider>
      <div class="price-desc">
        <p>
          <em>划线价格：</em>划线的价格可能是课程的非活动价、曾经展示过的销售价等，仅供您参考。
        </p>
        <p>
          <em>未划线价格：</em>未划线的价格是课程的销售标价，具体的成交价格可能因会员使用优惠券、积分等发生变化，最终以订单结算价格为准。
        </p>
        <p>*此说明仅当出现价格比较时有效。若课程针对划线价格进行了特殊说明，以特殊说明为准。</p>
      </div>
    </van-collapse-item>
  </van-collapse>
</template>

<script>
import { Divider, Collapse, CollapseItem, Icon } from 'vant';

export default {
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
    'van-divider': Divider,
    'van-icon': Icon,
  },

  data() {
    return {
      active: [],
    };
  },

  rootState: ['goodsData', 'activityData', 'env'],
  rootGetters: ['isColumn', 'isOnlineCourse'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      if (this.hasActivityPrice) {
        return true;
      }
      return Boolean(this.goodsData.origin);
    },

    hasActivityPrice() {
      const { sku } = this.activityData;
      return sku && Number.isInteger(sku.minPrice) && Number.isInteger(sku.maxPrice);
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    open() {
      return Boolean(this.active.length);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.price-desc-block {
  padding: 0 16px;
  margin: -8px 0 8px;
  background-color: $white;

  .divider {
    margin: 0;
    line-height: 40px;

    .divider-title {
      font-size: 14px;
      color: $main-text-color;
    }

    .divider-icon {
      margin-left: 8px;
      color: #dcdee0;
      transform: rotate(90deg);
      transition: transform .3s linear;

      &.open {
        transform: rotate(-90deg);
      }
    }
  }

  ::v-deep .van-collapse-item__title {
    padding: 0;
  }

  ::v-deep .van-collapse-item__content {
    padding: 8px 0 16px;
  }
}

.price-desc {
  padding: 12px 8px;
  font-size: 12px;
  line-height: 16px;
  color: $disabled-color;
  background-color: #f7f8fa;
  border-radius: 4px;

  p {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  em {
    color: $main-text-color;
  }
}
</style>
