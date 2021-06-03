<template>
  <popup :value="value" v-on="proxyListeners" class="activity-rule">
    <div class="activity-rule__container">
      <div class="activity-rule__title">
        活动规则
      </div>
      <div class="activity-rule__list">
        <reward-list
          v-for="(item, index) in rewardsList"
          :key="index"
          :nodeTitle="item.nodeTitle"
          :title="item.title"
          :couponList="item.couponList"
          :presentList="item.presentList"
          :point="item.point"
        />
      </div>
      <section class="activity-rule__detail">
        <p class="title">详细规则:</p>
        <div class="rule-text">{{ ruleDesc }}</div>
      </section>
      <div class="activity-rule__btn">
        <main-button text="我知道了" @handle-click="onClickClose" />
      </div>
    </div>
  </popup>
</template>

<script>
import { Popup } from '@youzan/vis-ui';
import { get } from 'lodash';
import { AWARD_DESC } from '../../constants';
import RewardList from '../reward-list';
import MainButton from '../main-button';
import { classifyAwards, getRewardDesc } from '../../utils';

export default {
  name: 'activity-rule',

  components: {
    Popup,
    RewardList,
    MainButton,
  },

  props: {
    oldRewards: {
      type: Array,
      default: () => {
        return [];
      },
    },

    newRewards: {
      type: Object,
      default: () => {
        return {};
      },
    },

    ruleDesc: {
      type: String,
      default: '',
    },

    value: {
      type: Boolean,
      default: false,
    },

    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {};
  },

  computed: {
    rewardsList() {
      let rules = [];
      this.oldRewards.forEach((item) => {
        const { couponList, presentList, point } = classifyAwards(item.awards);
        let ruleItem = {
          nodeTitle: AWARD_DESC[item.awardNode],
          title: item.awardDesc.freestyleDesc || '',
          presentList,
          couponList,
          point,
        };
        rules.push(ruleItem);
      });
      const awardDesc = get(this.newRewards, 'awardDesc', {});
      const awards = get(this.newRewards, 'awards', []);
      const { couponList, presentList, point } = classifyAwards(awards);
      let title = getRewardDesc({ awardDesc, awards });
      const newRewardItem = {
        nodeTitle: '好友可得',
        title,
        couponList,
        presentList,
        point,
      };
      rules.push(newRewardItem);
      return rules;
    },
  },

  methods: {
    onClickClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-rule {
  &__container {
    position: relative;
    padding-bottom: 60px;
  }

  &__title {
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }

  &__detail {
    padding: 0px 16px 40px;
    font-size: 14px;
    line-height: 22px;
    color: #323233;
    white-space: pre-wrap;
    .title {
      font-weight: 500;
    }
  }

  &__list {
    padding: 0 16px;
  }

  &__btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 16px;
  }
}
</style>
