<template>
  <popup
    :value="value"
    :buttons="buttons"
    v-on="proxyListeners"
    class="activity-rule"
  >
    <div class="activity-rule__title">
      活动规则
    </div>
    <section class="activity-rule__detail">
      <p>
        活动规则:
      </p>
      <ul>
        <li
          v-for="(item, index) in rules"
          :key="index"
        >
          {{ index + 1 }}、{{ item }}
        </li>
      </ul>

      <br>

      <p>
        参与条件:
      </p>
      <p>
        {{ conditionText }}
      </p>

      <br>

      <p>
        如何参与:
      </p>
      <p>
        {{ joinText }}
      </p>
    </section>
  </popup>
</template>

<script>
import { Popup } from '@youzan/vis-ui';
import { AWARD_DESC, INTRODUCER_RULE } from '../../constants';

export default {
  name: 'activity-rule',

  components: {
    Popup,
  },

  props: {
    oldRewards: {
      type: Array,
      default: () => {
        return [];
      },
    },

    introducerRule: {
      type: Number,
      default: 1,
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
    return {
      buttons: [
        {
          text: '知道了',
          color: '#fc4952',
          onClick: this.onClickClose,
        },
      ],
    };
  },

  computed: {
    rules() {
      let rules = [];
      this.oldRewards.forEach(item => {
        let ruleItem = AWARD_DESC[item.awardNode];
        let awardDesc = [];
        item.awards.forEach(award => {
          awardDesc.push(award.awardBizId);
        });
        ruleItem = `${ruleItem}${awardDesc.join(',')}`;
        rules.push(ruleItem);
      });
      return rules;
    },

    conditionText() {
      return INTRODUCER_RULE[this.introducerRule];
    },

    joinText() {
      return '学员分享活动链接、家校圈内容、自己制作海报或者海报模板给自己的好友即可参与活动。';
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
  &__title {
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }

  &__detail {
    padding: 16px 24px 26px;
    font-size: 14px;
    line-height: 22px;
    color: #39393a;
  }
}
</style>
