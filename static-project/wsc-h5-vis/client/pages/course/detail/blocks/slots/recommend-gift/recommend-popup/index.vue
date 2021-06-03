<template>
  <vis-popup-close :show-pop="show" @close-pop="show = false">
    <div class="container">
      <div class="fake-header">
        <img src="https://img01.yzcdn.cn/upload_files/2020/11/09/FtTkPRS-fuLJcF65hfV6b_5AO0dj.png" class="header">
        <div class="fake-close" @click="show = false" />
      </div>
      <div class="content-with-bg">
        <p class="task-tip">
          {{ recommendGift.helpedCount ?
            '再': '' }}邀请<span>{{ remianHelpCount }}</span>位好友立即领取
        </p>
        <p class="task-awards">
          {{ nextPhaseReward.rewardName || '课程大礼包' }}
        </p>
        <div v-if="recommendGift.helpedCount" class="task-invite-users">
          <avatar-group :list="inviteRecord.list.slice(0,2)" size="20px" />
          <span>{{ recommendGift.helpedCount }}位已领取</span>
        </div>
        <div class="award-list">
          <div v-if="nextPhaseReward.presentList && nextPhaseReward.presentList.length" class="award-item">
            <div class="left">
              <img :src="RewardIcon.present">
            </div>
            <div class="right">
              <div class="award-name">
                赠品 × {{ nextPhaseReward.presentList.length }}
              </div>
              <div class="award-content">
                {{ nextPhaseReward.presentList.map(item => item.name).join('、') }}
              </div>
            </div>
          </div>
          <div v-if="nextPhaseReward.couponList && nextPhaseReward.couponList.length" class="award-item">
            <div class="left">
              <img :src="RewardIcon.coupon">
            </div>
            <div class="right">
              <div class="award-name">
                优惠券 × {{ nextPhaseReward.couponList.length }}
              </div>
              <div class="award-content">
                {{ nextPhaseReward.couponList.map(item => item.name).join('、') }}
              </div>
            </div>
          </div>
          <div v-if="nextPhaseReward.bonusPoint" class="award-item">
            <div class="left">
              <img :src="RewardIcon.point">
            </div>
            <div class="right">
              <div class="award-name">
                {{ nextPhaseReward.bonusPoint }}{{ pointName }}
              </div>
            </div>
          </div>
        </div>

        <div class="share-btn" @click="openShareWechat">
          免费送课给好友
        </div>
      </div>
    </div>
  </vis-popup-close>
</template>

<script>
import { PopupClose } from '@youzan/vis-ui';
import AvatarGroup from 'components/avatar-group';
import { mapGetters, mapState, mapActions } from 'vuex';
import { RewardIcon } from '@/domain/recommend-gift/constant.js';

export default {
  components: {
    'vis-popup-close': PopupClose,
    AvatarGroup,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      RewardIcon,
    };
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift', 'inviteRecord', 'pointName']),
    ...mapGetters('recommend-gift', ['goodsData', 'nextPhaseReward']),
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('close');
      },
    },
    remianHelpCount() {
      return (this.nextPhaseReward.helpCount - this.recommendGift.helpedCount) || 0;
    },
  },
  methods: {
    ...mapActions('recommend-gift', ['openShareWechat']),
  },
};
</script>

<style lang="scss" scoped>
.van-popup {
  overflow-y: initial;
}

.container {
  position: relative;
  width: 310px;
}

.content-with-bg {
  min-height: 160px;
  padding: 12px;
  padding-top: 30px;
  background-color: #fdf2e3;
  border-radius: 20px;
  box-shadow: inset 0 -1px 3px 0 rgba(255, 169, 156, .7), inset 0 2px 2px 0 #fffcf0;
  box-sizing: border-box;
}

.fake-header {
  position: relative;
  height: 40px;
}

.fake-close {
  position: absolute;
  top: -33px;
  right: 2px;
  width: 25px;
  height: 25px;
}

.header {
  position: absolute;
  top: -118px;
  right: 0;
  left: 0;
  width: 100%;
}

.task-tip,
.task-invite-users {
  margin-top: 10px;
  font-size: 14px;
  color: #ba8849;
  text-align: center;
}

.task-tip {
  span {
    padding: 0 2px;
    font-size: 14px;
    font-weight: bold;
    color: #ff5100;
  }
}

.task-invite-users {
  display: flex;
  margin-top: 8px;
  align-items: center;
  justify-content: center;

  span {
    margin-left: 8px;
  }
}

.task-awards {
  margin-top: 4px;
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  color: #ff5100;
  text-align: center;
}

.award-list {
  margin-top: 16px;
}

.award-item {
  padding: 12px 18px;
  background-color: #fff;
  border-radius: 10px;

  .left {
    position: relative;
    float: left;
    width: 50px;
    height: 50px;
    min-width: 50px;
    margin-right: 16px;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
    }
  }

  .right {
    display: flex;
    min-height: 50px;
    flex-direction: column;
    justify-content: center;

    .award-name {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #39393a;
    }

    .award-content {
      margin-top: 4px;
      overflow: hidden;
      font-size: 12px;
      color: #aaabad;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.award-item + .award-item {
  margin-top: 8px;
}

.share-btn {
  height: 64px;
  margin-top: 16px;
  font-size: 24px;
  font-weight: bold;
  line-height: 64px;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(131deg, #ff7b17 0%, #ff2b00 100%);
  border-radius: 8px;
}
</style>
