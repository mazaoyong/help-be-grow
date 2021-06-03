<template>
  <view-wrapper>
    <earn-info show-withdrawal />
    <div v-if="showInvite" class="invite-btn" @click="handleInviteBtn">
      继续邀请赚奖励
    </div>
  </view-wrapper>
</template>

<script>
import ViewWrapper from '../../components/view-wrapper';
import EarnInfo from '../../components/earn-info';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  components: {
    EarnInfo,
    ViewWrapper,
  },
  computed: {
    showInvite() {
      if (this.isCourseEntry) {
        if (this.onlyPhaseReward) {
          return !this.getHighestPhase;
        } else {
          return true;
        }
      } else {
        return !!this.recommendGoodsList.length;
      }
    },
    ...mapState('recommend-gift', ['recommendGift', 'recommendGoodsList']),
    ...mapGetters('recommend-gift', ['onlyPhaseReward', 'getHighestPhase']),
    ...mapGetters(['isUserCenterEntry', 'isCourseEntry']),
  },
  methods: {
    ...mapActions('recommend-gift', ['openSharePoster']),
    handleInviteBtn() {
      if (this.isUserCenterEntry) {
        this.$emit('showRecommendPop');
      } else if (this.isCourseEntry) {
        this.openSharePoster();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin-left: 5px;
}
.invite-btn {
  margin: 0 auto;
  width: 270px;
  margin-top: 22px;
  background-image: linear-gradient(90deg, #FF7B17 0%, #FF2B00 100%);
  border-radius: 32px;
  font-size: 18px;
  color: #FFFFFF;
  line-height: 48px;
  height: 48px;
  text-align: center;
  font-weight: bold;
}
</style>
