<template>
  <div class="order-detail__button" @click="onClick">
    <span
      v-log:click="{
        ei: 'edu_click_btn',
        en: '教育下单点击页面按钮',
        pt: 'trade',
        params: {
          btn_name: 'edu_order_detail'
        }
      }"
      class="order-detail__button-text"
    >明细</span>
    <van-icon
      class="order-detail__button-icon"
      :class="{ 'order-detail__button-icon--active': isShowOrderDetail }"
      name="arrow-up"
      size="14"
    />
    <popup
      v-model="isShowOrderDetail"
      class="order-detail"
      title="明细"
      get-container="body"
      closeable
    >
      <div class="order-detail__list van-hairline--bottom">
        <div class="order-detail__content order-detail__text--bold">
          <span>商品总价</span>
          <span>{{ orderOriginPrice | formatMoney }}</span>
        </div>

        <div
          v-for="item in contentList"
          :key="item.label"
          class="order-detail__content"
        >
          <span>{{ item.label }}</span>
          <span>-{{ item.value | formatMoney }}</span>
        </div>
      </div>
      <div class="order-detail__footer">
        <div>
          <span>共优惠</span>
          <span v-theme.main>{{ orderDiscountPrice | formatMoney }}</span>
        </div>

        <div class="order-detail__amount">
          <span class="order-detail__text--bold">合计：</span>
          <span>{{ orderFinalPrice | formatMoney }}</span>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { Popup } from '@youzan/vis-ui';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export default {
  name: 'more',

  components: {
    'van-icon': Icon,
    Popup,
  },

  state: [
    'pay',
    'shop',
    'timelimitDiscount',
    'secKill',
    'fansBenefit',
  ],

  getters: [
    'singleGoods',
    'activityDecrease',
    'couponDecrease',
    'prepayCardDecrease',
    'orderOriginPrice',
    'orderFinalPrice',
    'orderPromotions',
    'tuitionDecrease',
  ],

  data() {
    return {
      isShowOrderDetail: false,
    };
  },

  computed: {
    // 商品级别活动
    activityLabel() {
      switch (this.shop.activityType) {
        case ACTIVITY_TYPE.SEC_KILL:
          return this.secKill.tag || '秒杀';
        case ACTIVITY_TYPE.RECOMMEND_GIFT:
          return '好友推荐专享';
        case ACTIVITY_TYPE.GROUP_BUY:
        case ACTIVITY_TYPE.LADDER_GROUPON:
          return '拼团';
        case ACTIVITY_TYPE.PACKAGE_BUY:
          return '优惠套餐';
      }

      switch (this.singleGoods.activityType) {
        case ACTIVITY_TYPE.CUSTOMER_DISCOUNT:
          return '会员优惠';
        case ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT:
          return this.timelimitDiscount.description || '限时折扣';
        default:
          return '';
      }
    },

    contentList() {
      const contentList = [
        {
          label: this.activityLabel,
          value: this.activityDecrease,
        },
        { label: '优惠券', value: this.couponDecrease },
        { label: this.fansBenefit.name, value: this.fansBenefit.value },
        { label: '储值抵扣', value: this.prepayCardDecrease },
      ];

      if (this.tuitionDecrease) {
        contentList.push(this.tuitionDecrease);
      }
      // 订单级的其他优惠
      if (this.orderPromotions.length > 0) {
        this.orderPromotions.forEach(item => {
          contentList.push({ label: item.name, value: item.decrease });
        });
      }
      return contentList.filter(({ label, value }) => label && value);
    },

    // 总优惠价
    // 商品总价 - 订单最后支付的价格
    orderDiscountPrice() {
      return this.orderOriginPrice - this.orderFinalPrice;
    },
  },

  methods: {
    onClick() {
      this.isShowOrderDetail = !this.isShowOrderDetail;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.order-detail {
  font-size: 14px;
  line-height: 20px;

  &__button {
    padding-right: 12px;
    display: flex;
    align-items: center;
    color: $disabled-color;
    flex: 0 0 auto;

    &-text {
      margin-right: 4px;
      font-size: 12px;
    }

    &-icon {
      transition: transform 0.3s linear;

      &--active {
        transform: rotate(180deg);
      }
    }
  }

  &__list {
    margin: 0 16px;
    padding: 16px 0 20px;
  }

  &__content {
    padding-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      padding-bottom: 0;
    }

    &:first-child {
      padding-bottom: 12px;
    }
  }

  &__footer {
    margin: 0 16px;
    padding: 16px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__amount {
    font-size: 16px;
  }

  &__text--bold {
    font-weight: 500;
  }
}
</style>
