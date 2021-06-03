<template>
  <div class="rule-pop">
    <h3 class="rule-pop__title">
      奖励规则
    </h3>
    <ul class="rule-pop__list">
      <li
        v-for="(item, index) in ruleList"
        :key="index"
        class="rule-pop__list-item">
        {{ item }}
      </li>
    </ul>
    <div class="rule-pop__close" @click="closePop">
      我知道了
    </div>
  </div>
</template>

<script>
export default {
  name: 'rule-pop',

  data() {
    return {
      ruleList: [
        '·只有老客，即购买过这门课程人才有“推荐有奖”的权益，可把同一个课程推荐给好友购买，享受优惠和奖励。',
        '·每成功推荐1位好友下单，即可获得相应的佣金奖励。',
        '·下单客人必须是新客，即没有购买过这个课程，可在下单的时候享受在原价基础上立减。',
        '·在“查看我的收益”页面里，可看到好友下单的记录并进入提现。',
        '·活动有效期结束后，即活动结束，由商家设置相关规则。',
      ],
    };
  },

  methods: {
    closePop() {
      this.$emit('closeRulePop');
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import 'var';

  .rule-pop {
    min-width: 240px;
    padding: 30px 20px;
    text-align: left;
    background-color: $c-white;

    &__title {
      line-height: 28px;
      margin-bottom: 18px;
      font-size: 20px;
      color: $c-black;
    }

    &__list {
      &-item {
        margin-bottom: 25px;
        line-height: 20px;
        font-size: 14px;
        color: $c-black;
      }
    }

    &__close {
      width: 100%;
      height: 45px;
      line-height: 45px;
      margin-top: 17px;
      background-color: $c-orange;
      border-radius: 2px;
      color: $c-white;
      font-size: 16px;
      text-align: center;
    }
  }
</style>
