<template>
  <div class="invitation-description">
    <p v-if="showNewCaptain" class="invitation-description__over">
      {{ overTip }}
    </p>
    <!-- 可显示倒计时 -->
    <template v-if="!isPromotionEnd && showCountdown">
      <p class="invitation-description__des">
        还差<span class="join-num">
          {{ remainJoinNum }}
        </span>人，
        {{ userGroupStatus.status ? '快喊小伙伴' : '快来' }}一起拼团吧
      </p>

      <p class="invitation-description__time">
        剩余
        <cap-countdown
          class="invitation-description__time-countdown"
          :start="startAt"
          :end="endTime"
          :hide-zero-day="true"
        />
        结束
      </p>
    </template>

    <p v-else class="invitation-description__des">
      {{ tipText }}
    </p>
  </div>
</template>

<script>
import { Countdown } from 'captain-ui';
import { GROUP_STATUS, USER_JOIN_GROUPON_STATUS } from 'pct/constants';

export default {
  name: 'invitation-description',

  components: {
    'cap-countdown': Countdown,
  },

  props: {
    // 活动状态
    promotionStatus: Number,
    // 团状态
    tuanStatus: Number,
    // 当前团的alias
    tuanAlias: String,
    // 用户对于团的状态
    userGroupStatus: Object,
    // 用户对于拼团活动的状态
    userGrouponStatus: Object,
    // 还剩几人成团
    remainJoinNum: Number,
    // 团开始时间
    startAt: Number,
    // 团结束时间
    endAt: Number,
    contentIsPaid: Boolean,
  },

  data() {
    return {
      overTip: '上个团已满，你已被选为新的团长',
    };
  },

  computed: {
    endTime() {
      return Date.now() + this.endAt;
    },

    // 已购买,当前团状态未凑团成功
    isCouldStudy() {
      if (this.contentIsPaid) {
        if (this.userGrouponStatus.status !== 2) {
          return true;
        } else {
          if (this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN) {
            return true;
          }
        }
      }
      return false;
    },

    // 已购买，由于用户参与当前团且团成功
    groupSuccessToPaid() {
      return this.contentIsPaid &&
        this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED &&
        this.userGrouponStatus.status === 2;
    },

    isPromotionEnd() {
      return this.promotionStatus === 2;
    },
    // 显示倒计时
    showCountdown() {
      // return !this.contentIsPaid && this.tuanStatus === GROUP_STATUS.GROUPON_WAITING && ((this.userGroponStatus.status === 0 && this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN) || this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED);
      if (!this.contentIsPaid && this.tuanStatus === GROUP_STATUS.GROUPON_WAITING) {
        // 用户参加了当前团或未参加活动
        return this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED || this.userGrouponStatus.status === 0;
      } else {
        return false;
      }
    },
    // 用户未购买，且为待开团，参与了该团，且为团长，而且从其他团开的团
    showNewCaptain() {
      return !this.contentIsPaid &&
        this.tuanStatus === GROUP_STATUS.GROUPON_WAITING &&
        this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED &&
        this.userGroupStatus.from_group_id &&
        this.userGroupStatus.is_head;
    },
    // 团已满
    showGrouponed() {
      return !this.contentIsPaid &&
        this.tuanStatus === GROUP_STATUS.GROUPONED &&
        this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN &&
        this.userGrouponStatus.status === 0;
    },
    // 团失效
    showGrouponFailure() {
      // return !this.contentIsPaid && this.tuanStatus === GROUP_STATUS.GROUPON_FAILURE;
      if (!this.contentIsPaid && this.tuanStatus === GROUP_STATUS.GROUPON_FAILURE) {
        // return this.userGrouponStatus.status === 0 || this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED;
        // 用户未参加活动
        return this.userGrouponStatus.status === 0;
      } else {
        return false;
      }
    },

    showGroupSuccess() {
      return this.contentIsPaid || (
        this.tuanStatus === GROUP_STATUS.GROUPONED &&
        this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED &&
        this.userGrouponStatus.status === 2
      );
    },
    // 已参加其他团
    showHasGroup() {
      return !this.contentIsPaid &&
        this.userGrouponStatus.status === 1 &&
        this.userGrouponStatus.group_alias !== this.tuanAlias;
      // return !this.contentIsPaid && this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN && this.userGrouponStatus.status === 1;
    },

    tipText() {
      if (this.isCouldStudy) {
        return '你已拥有该付费知识，不用再买了哦';
      } else if (this.groupSuccessToPaid) {
        return '恭喜你，拼团成功啦';
      } else {
        if (this.isPromotionEnd) {
          return '活动已结束，去看看其他商品吧';
        } else {
          if (this.showGrouponed) {
            return '此团已满，去开个新团吧';
          } else if (this.showGrouponFailure) {
            return '此团已失效，去开个新团吧';
          } else if (this.showHasGroup) {
            return '你已有1个进行中的团啦，不能再买了哦';
          }
        }
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
  @import 'var';

  .invitation-description {
    padding-bottom: 15px;
    font-size: 16px;
    color: $c-black;
    text-align: center;

    &__over {
      margin-bottom: 10px;
      font-size: 12px;
    }

    &__des {
      font-weight: 500;
      .join-num {
        padding: 0 5px;
        font-size: 18px;
        color: $c-red-light;
      }
    }

    &__time {
      margin-top: 14px;
      font-size: 12px;
      color: $c-gray-dark;

      &-countdown {
        .cap-countdown__day,
        .cap-countdown__hour,
        .cap-countdown__minute,
        .cap-countdown__second,
        .cap-countdown__time-text {
          padding: 0;
          margin: 0;
          background-color: transparent;
          color: $c-red-light;
        }
      }
    }
  }
</style>
