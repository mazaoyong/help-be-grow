<template>
  <div class="reward-detail">
    <div class="reward-detail__old">
      <template v-if="oldRewards.length > 0">
        <div class="tip">
          邀请好友，送你以下奖励
        </div>
        <template
          v-for="(item, index) in oldRewards"
        >
          <reward-item
            :key="index"
            :award-node="item.awardNode"
            :awards="item.awards"
            :page-style="pageStyle"
          />
        </template>

        <section class="new-reward__wrap">
          <div class="tip">
            好友可获得奖励
          </div>
          <reward-item
            :award-node="0"
            :awards="newReward"
            :page-style="pageStyle"
          />
        </section>
      </template>

      <!-- 兼容老活动逻辑 -->
      <section v-else class="reward-detail__old-content">
        <div v-for="(item, index) in ruleList" :key="index">
          <h4>{{ item.title }}</h4>
          <p v-html="item.content" />
        </div>
      </section>
      <!-- 行动按钮 -->
      <action-buttons
        :page-style="pageStyle"
        :status="status"
        @btnClick="onBtnClick"
      />
    </div>
  </div>
</template>

<script>
import RewardItem from './reward-item';
import ActionButtons from '../action-buttons';

export default {
  name: 'reward-detail',

  components: {
    RewardItem,
    ActionButtons,
  },

  props: {
    oldRewards: {
      type: Array,
      default: () => {
        return [];
      },
    },

    pageStyle: {
      type: Number,
      default: 1,
    },

    newRewards: {
      type: String,
      default: '',
    },

    ruleList: {
      type: Array,
      default: () => {
        return [];
      },
    },

    status: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    newReward() {
      return [{
        'awardBizId': this.newRewards,
      }];
    },
  },

  methods: {
    onBtnClick(type) {
      this.$emit('action', type);
    },
  },
};
</script>

<style lang="scss" scoped>
.reward-detail {
  padding: 0 16px 24px;
  /* background-color: #fd6113; */

  &__old {
    padding: 12px;
    border-radius: 12px;;
    background-color: #fff;

    .tip {
      margin-bottom: 12px;
      line-height: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #39393a;
    }

    &-content {
      div {
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 20px;
        color: #39393a;

        h4 {
          font-weight: 500;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .new-reward__wrap {
    margin-top: 14px;
  }
}
</style>
