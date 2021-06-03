<template>
  <div class="reward-wrap" :class="lock ? 'lock': ''">
    <div class="title">
      <div class="name">
        {{ reward.rewardName || '课程大礼包' }}
      </div>
      <div v-if="lock" class="status">
        已获得
      </div>
    </div>
    <div v-if="reward.presentList" class="block">
      <img class="reward-icon" :src="RewardIcon.present">
      <ul class="reward-list">
        <li v-for="present in reward.presentList" :key="present.id">
          {{ present.name }} × {{ present.quantity }}
        </li>
      </ul>
    </div>
    <div v-if="reward.couponList" class="block">
      <img class="reward-icon" :src="RewardIcon.coupon">
      <ul class="reward-list">
        <li v-for="coupon in reward.couponList" :key="coupon.id">
          {{ getCouponName(coupon) }}{{ getSuffixCouponName(coupon.type) }} × {{ coupon.quantity }}
        </li>
      </ul>
    </div>
    <div v-if="reward.bonusPoint" class="block">
      <img class="reward-icon" :src="RewardIcon.point">
      <ul class="reward-list">
        <li>{{ reward.bonusPoint }}{{ pointName }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { RewardIcon } from '@/domain/recommend-gift/constant';
import { getSuffixCouponName, getCouponName } from '@/domain/recommend-gift/utils';
import { mapState } from 'vuex';
export default {
  props: {
    reward: {
      type: Object,
      default: () => ({}),
    },
    // 解锁
    lock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      RewardIcon,
    };
  },
  computed: {
    ...mapState('recommend-gift', ['pointName']),
  },
  methods: {
    getCouponName,
    getSuffixCouponName,
  },
};
</script>

<style lang="scss" scoped>
.reward-wrap {
  padding: 16px;
}
.reward-wrap.lock {
  .status {
    color: #FF5B00;
  }
  .name {
    color: #FF5B00;
  }
  .block {
    background-color:  #FDF3E4;
  }
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .name {
    font-size: 16px;
    font-weight: 500;
    color:#323233;
    line-height: 22px;
  }
  .status {
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
  }
}
.block {
  margin-top: 8px;
  background-color:#F7F8FA;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.reward-icon {
  width: 38px;
}
.reward-list {
  margin-left: 12px;
  li {
    font-size: 14px;
    font-weight: 400;
    color: #323233;
    line-height: 20px;
  }
  li + li {
    margin-top: 6px;
  }
}
</style>
