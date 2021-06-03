<template>
  <section-container title="奖励详细">
    <div class="reward-list">
      <reward-item
        v-if="newStudentRewardSetting.presentList.length > 0"
        :type="3"
        :list="newStudentRewardSetting.presentList | formatList"
      />
      <reward-item
        v-if="newStudentRewardSetting.couponList.length > 0"
        :type="2"
        :list="newStudentRewardSetting.couponList | formatList"
      />
    </div>
  </section-container>
</template>

<script>
import SectionContainer from '../../../components/section-container';
import RewardItem from '../../../components/reward-item';

export default {
  name: 'reward-list',
  data() {
    return {};
  },
  props: {
    newStudentRewardSetting: {
      type: Object,
      default: () => ({
        couponList: [],
        presentList: [],
      }),
    },
  },
  computed: {},
  filters: {
    formatList(list) {
      return list.map((item) => {
        return {
          awardCopywriting: item.title,
          awardAmount: item.quantity,
        };
      });
    },
  },
  components: {
    SectionContainer,
    RewardItem,
  },
};
</script>

<style lang="scss" scoped>
@import '../../../new-student/blocks/reward-list/index.scss';
</style>
