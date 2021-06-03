<template>
  <div class="old-header">
    <div class="old-header__first">
      <span @click="onClickRule" class="rule">活动规则</span>
      <join-count-banner v-if="showJoinNum && count > 0" :count="count" />
      <span @click="onClickRecord" class="record">我的成就</span>
    </div>
    <div class="old-header__title">
      <div class="title-item">{{ oldStuRewardTip }}</div>
      <div class="title-item">好友可得{{ newStuRewardTip }}</div>
    </div>
  </div>
</template>

<script>
import JoinCountBanner from '../../../components/join-count-banner';

export default {
  name: 'old-header',

  components: {
    JoinCountBanner,
  },

  props: {
    count: {
      type: Number,
      default: 0,
    },

    showJoinNum: {
      type: Number,
      default: 0,
    },

    oldStuRewardTip: {
      type: String,
    },

    newStuRewardTip: {
      type: String,
    },
  },

  methods: {
    onClickRecord() {
      this.$emit('clickRecord');
    },

    onClickRule() {
      this.$emit('clickRule');
    },
  },
};
</script>

<style lang="scss" scoped>
.old-header {
  position: relative;
  padding-top: 16px;

  &__first {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;

    .rule,
    .record {
      padding: 0 8px 0 16px;
      margin-left: -12px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      font-size: 12px;
      line-height: 26px;
      color: #fff;
    }

    .record {
      padding: 0 16px 0 8px;
      margin-right: -12px;
    }
  }

  &__title {
    padding: 48px 16px 34px;
    text-align: center;
    color: #ffec91;
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
  }
}
</style>
