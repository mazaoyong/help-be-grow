<template>
  <card v-if="isShowCard" title="本单可享">
    <!-- 会员优惠 -->
    <membership-cell v-if="isShowMembershipCell" />

    <!-- 学费优惠 -->
    <tuition-cell v-if="isShowTuitionCell" />

    <!-- 优惠券 -->
    <coupon-cell v-if="isShowCouponCell" />

    <!-- 粉丝优惠 -->

    <fans-cell v-if="isShowFansCell" />

    <!-- 赠品 -->
    <present-cell v-if="isShowPresentCell" />
  </card>
</template>

<script>
import { get, isEmpty } from 'lodash';
import { Card } from '@/pages/trade/buy/components/card';
import MembershipCell from './components/membership-cell';
import CouponCell from './components/coupon-cell';
import PresentCell from './components/present-cell';
import FansCell from './components/fans-cell';
import TUITIONCELL from './components/tuition-cell';

export default {
  name: 'ump-block',

  components: {
    Card,
    MembershipCell,
    CouponCell,
    PresentCell,
    [FansCell.name]: FansCell,
    [TUITIONCELL.name]: TUITIONCELL,
  },

  state: ['customerCard', 'coupon', 'order', 'present', 'fansBenefit', 'tuition'],

  getters: [
    'isOrderCreated',
    'isPackageBuy',
    'isGroupBuy',
    'isPointsExchange',
    'isSecKill',
    'useExclusionCard',
    'isShowTuitionCell',
  ],

  computed: {
    isShowCard() {
      return (
        this.isShowMembershipCell ||
        this.isShowCouponCell ||
        this.isShowPresentCell ||
        this.isShowFansCell
      );
    },

    isShowMembershipCell() {
      return this.customerCard.list.length > 0;
    },

    isShowCouponCell() {
      return !this.coupon.forbidCoupon;
    },

    isShowPresentCell() {
      return (
        !isEmpty(this.present) &&
        !this.isPackageBuy &&
        !this.isGroupBuy &&
        !this.isPointsExchange &&
        !this.isSecKill &&
        !this.useExclusionCard
      );
    },

    isShowFansCell() {
      return get(this.fansBenefit, 'value') > 0;
    },
  },
};
</script>
