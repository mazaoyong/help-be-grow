<template>
  <view-wrapper>
    <div
      v-if="curInviteRecord.pageRequest.total"
      class="avatar-wrap"
      :class="{
        'align-left': isCourseEntry,
        'align-center': isUserCenterEntry
      }"
    >
      <avatar-group :list="avatarList" />
      <div class="avatar-group-link" @click="showInviteList = true">
        {{ curInviteRecord.pageRequest.total }}人已报名
        <van-icon name="arrow" color="#646566" size="14px" />
      </div>
      <invite-list-pop v-model="showInviteList" :invite-record="curInviteRecord">
        <div
          v-if="showGoOnShare"
          slot="bottom"
          class="invite-btn"
          @click="handleGoShare"
        >
          继续邀请赚奖励
        </div>
      </invite-list-pop>
    </div>
    <div v-if="isCourseEntry" class="invite-wrap">
      <div v-if="getHighestPhase" class="invite-tips">
        已获得所有奖励
      </div>
      <div v-else class="invite-tips">
        {{ recommendGift.helpedCount ? "再" : "" }}邀请
        {{ remainInvited }} 位好友，即可获得{{
          nextPhaseReward.rewardName || "课程大礼包"
        }}
      </div>
      <stage-progress
        :stage="stageRewards"
        :cur-num="recommendGift.helpedCount"
        progress-key="helpCount"
        class="stage-progress"
      />
    </div>
  </view-wrapper>
</template>

<script>
import { Icon } from 'vant';
import { mapActions, mapGetters, mapState } from 'vuex';

import AvatarGroup from 'components/avatar-group';
import ViewWrapper from '../../../components/view-wrapper';
import StageProgress from './StageProgress';
import InviteListPop from './InviteListPop';

export default {
  components: {
    AvatarGroup,
    StageProgress,
    ViewWrapper,
    InviteListPop,
    'van-icon': Icon,
  },
  data: () => {
    return {
      showInviteList: false,
    };
  },
  computed: {
    ...mapGetters('recommend-gift', ['nextPhaseReward', 'getHighestPhase', 'onlyPhaseReward']),
    ...mapState('recommend-gift', ['inviteRecord', 'activityInviteRecord', 'recommendGift', 'recommendGoodsList']),
    ...mapGetters(['isCourseEntry', 'isUserCenterEntry']),
    pageRequest() {
      return this.inviteRecord.pageRequest;
    },
    curInviteRecord() {
      if (this.isCourseEntry) {
        return this.activityInviteRecord;
      } else {
        return this.inviteRecord;
      }
    },
    stageRewards() {
      const phasedRewardDetails = this.recommendGift.phasedRewardDetails;

      if (phasedRewardDetails) {
        const realPhase = this.recommendGift.phasedRewardDetails.slice();
        realPhase.unshift({ helpCount: 0 });
        return realPhase;
      } else {
        return [];
      }
    },
    avatarList() {
      return this.curInviteRecord.list.slice(0, 6);
    },
    remainInvited() {
      return this.nextPhaseReward.helpCount - this.recommendGift.helpedCount;
    },
    // 展示继续分享按钮
    showGoOnShare() {
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
  },
  methods: {
    ...mapActions('recommend-gift', ['openSharePoster']),
    handleGoShare() {
      this.showInviteList = false;
      if (this.isCourseEntry) {
        this.openSharePoster();
      } else {
        this.$emit('showRecommendPop');
      }
    },
  },

};
</script>

<style lang="scss" scoped>
.avatar-wrap {
  display: flex;
  align-items: center;
}
.avatar-wrap.align-center {
  justify-content: center;
}
.avatar-wrap.align-left {
  justify-content: left;
}

.avatar-group-link {
  margin-left: 4px;
  padding: 0 8px;
  height: 26px;
  background:#F2F3F5;
  border-radius: 14px;
  font-size: 14px;
  line-height: 26px;
  font-weight: 400;
  color: #646566;
  display: flex;
  align-items: center;
}

.invite-wrap {
  margin-top: 16px;
}

.invite-tips {
  font-size: 14px;
  font-weight: 500;
  color: #323232;;
}
.stage-progress {
  margin-top: 10px;
}
.invite-btn {
  background-image: linear-gradient(131deg, #FF7B17 0%, #FF2B00 100%);
  border-radius: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
  height: 44px;
  line-height: 44px;
  margin-top: 40px;
}
</style>
