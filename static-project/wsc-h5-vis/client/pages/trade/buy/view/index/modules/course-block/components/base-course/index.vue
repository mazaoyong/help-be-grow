<template>
  <card>
    <template slot="head">
      <!-- 商品tag和标题 -->
      <div class="course__title">
        <mini-font-tag
          v-if="tag"
          class="course__tag"
          height="16px"
          :background-color="$theme.colors.main"
          :text="tag"
        />
        <span class="title">{{ singleGoods.title }}</span>
      </div>

      <!-- 商品状态 -->
      <div
        v-for="(item, index) in contentList"
        :key="index"
        class="course-content__item"
      >
        <vis-icon
          v-if="item.icon"
          class="course-content__icon"
          :name="item.icon"
          size="16"
        />
        <span>{{ item.text }}</span>
      </div>

      <!-- 单商品多数量展示(知识付费送好友场景) -->
      <div v-if="isGift" class="course__block--right">
        <ump-tag class="course__tag--ump" />
        <span class="course__goods-price">{{
          singleGoods.payPrice | formatMoney
        }}</span>
        <span v-if="isShowOriginPrice" class="course__origin-price">{{
          singleGoods.price | formatMoney
        }}</span>
        <span class="course__num--mult">x{{ singleGoods.num }}</span>
      </div>
    </template>

    <div class="course__block--right">
      <!-- 默认展示 -->
      <template>
        <template v-if="isGift">
          <span class="course__num--desc">共{{ singleGoods.num }}件</span>
          <span>商品小计：</span>
        </template>
        <ump-tag v-else class="course__tag--ump" />

        <points-price
          v-if="isPointsExchange"
          v-theme.main
          :points-price="pointsExchange.pointsPrice"
          :points-name="shop.pointsName"
          :price="pay.itemPay"
        />

        <span
          v-else-if="orderOriginPrice === 0"
          v-theme.main
          class="course__free-price"
        >免费</span>
        <cap-price
          v-else
          v-theme.main
          class="course__cap-price"
          :price="pay.itemPay"
          :origin-price="isShowOriginPrice && !isGift ? orderOriginPrice : undefined"
        />
      </template>
    </div>
  </card>
</template>

<script>
import { includes } from 'lodash';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

import { Price } from '@youzan/captain';
import { Icon } from '@youzan/vis-ui';
import { Card } from '@/pages/trade/buy/components/card';
import PointsPrice from '@/pages/trade/buy/components/points-price';
import MiniFontTag from 'components/mini-font-tag';
import UmpTag from '../ump-tag';

export default {
  name: 'base-course',

  components: {
    'vis-icon': Icon,
    'cap-price': Price,
    Card,
    MiniFontTag,
    UmpTag,
    PointsPrice,
  },

  props: {
    tag: {
      type: String,
      default: undefined,
    },

    contentList: {
      type: Array,
      default: () => [],
    },
  },

  state: ['pointsExchange', 'shop', 'pay'],

  getters: ['singleGoods', 'isPointsExchange', 'isGift', 'orderOriginPrice'],

  computed: {
    isShowOriginPrice() {
      // 仅会员折扣，限时折扣，拼团有划线价(原价展示)
      return includes(
        [
          ACTIVITY_TYPE.CUSTOMER_DISCOUNT,
          ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT,
          ACTIVITY_TYPE.GROUP_BUY,
        ],
        this.singleGoods.activityType
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.course {
  &__tag {
    padding: 0 3px;
    margin-right: 4px;
    vertical-align: 1px;
  }

  &__tag--ump {
    margin-right: 4px;
    vertical-align: text-bottom;
  }

  &__title {
    padding: 12px 0;
    font-size: 15px;
    line-height: 18px;
  }

  &__block--right {
    line-height: 44px;
    height: 44px;
    text-align: right;
    font-size: 14px;
    font-weight: normal;
  }

  &__goods-price {
    font-weight: 500;
  }

  &__origin-price {
    font-size: 12px;
    padding-left: 4px;
    color: $disabled-color;
    text-decoration: line-through;
  }

  &__free-price {
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
  }

  &__num--mult {
    padding-left: 8px;
    color: $disabled-color;
  }

  &__num--desc {
    color: $disabled-color;
    padding-right: 8px;
  }

  &__cap-price {
    font-size: 0;
  }
}

.course-content {
  &__item {
    padding-bottom: 8px;
    line-height: 17px;
    font-size: 13px;
    font-weight: normal;
    display: flex;
    align-items: center;
  }

  &__icon {
    margin-right: 4px;
    flex: 0 0 auto;
  }
}

.vis-biz-card__body {
  padding: 0 12px;
}
</style>
