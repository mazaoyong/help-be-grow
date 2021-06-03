<template>
  <div class="reward-list">
    <div class="reward-list-node">
      {{ nodeTitle }}
    </div>
    <div class="reward-list-title">
      {{ title }}
    </div>
    <div class="reward-list-list">
      <reward-item v-if="presentList.length > 0" :type="3" :list="presentList" />
      <reward-item v-if="couponList.length > 0" :type="2" :list="couponList" />
      <reward-item v-if="point.awardAmount > 0" :type="1" :pointCount="point.awardAmount" />
    </div>
  </div>
</template>

<script>
import RewardItem from '../reward-item';

export default {
  name: 'reward-list',
  data() {
    return {};
  },
  props: {
    nodeTitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    presentList: {
      type: Array,
      default: () => [],
    },
    point: {
      type: Object,
      default: () => ({
        type: 1,
        awardAmount: 0,
      }),
    },
  },
  components: {
    RewardItem,
  },
};
</script>

<style lang="scss" scoped>
.reward-list {
  margin-bottom: 16px;

  &-node {
    font-size: 12px;
    line-height: 17px;
    color: #969799;
  }

  &-title {
    margin-top: 2px;
    font-size: 14px;
    line-height: 20px;
    color: #ff5100;
    font-weight: 500;
  }

  &-list {
    margin-top: 12px;
  }
}
</style>
