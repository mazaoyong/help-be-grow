<template>
  <view-wrapper :show-padding="false">
    <div :class="stages.length === 1 ? 'hideTabTitle': ''">
      <van-tabs v-model="active" :border="false" color="#FF5100">
        <van-tab
          v-for="stage in stages"
          :key="stage.helpCount"
          :title="`${stage.helpCount}人奖励`"
        >
          <reward-blocks
            :reward="stage"
            :lock="recommendGift.helpedCount >= stage.helpCount"
          />
        </van-tab>
      </van-tabs>
    </div>
  </view-wrapper>
</template>

<script>
import { Tab, Tabs } from 'vant';
import ViewWrapper from '../../../components/view-wrapper';
import RewardBlocks from './RewardBlocks';
import { mapState } from 'vuex';
export default {
  components: {
    ViewWrapper,
    RewardBlocks,
    'van-tab': Tab,
    'van-tabs': Tabs,
  },
  props: {
    stages: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift']),
    active: {
      get() {
        if (this.recommendGift) {
          const { currentPhase } = this.recommendGift;
          return currentPhase ? currentPhase - 1 : 0;
        } else {
          return 0;
        }
      },
      set() {},
    },
  },
};
</script>

<style lang="scss">
.hideTabTitle {
  .van-tabs__wrap {
    display: none;
  }
}
</style>
