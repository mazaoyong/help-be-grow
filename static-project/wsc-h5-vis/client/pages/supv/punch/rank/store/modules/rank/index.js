import Args from '@youzan/utils/url/args';
import { getPersonRank } from 'supv/punch/apis/rank';
import {
  PROCEED_STATUS,
} from 'supv/punch/constants';
import {
  UPDATE_USER_RANK,
} from './mutationTypes';

export default {
  namespaced: true,
  state: {
    alias: Args.get('alias') || '',
    userRank: {
      avatar: '',
      cumulativeCount: 0,
      fansType: 0,
      fansId: '',
      nickname: '',
      openReward: 0,
      proceedStatus: PROCEED_STATUS.UNSTART,
      rewards: [],
      rank: 0,
      totalDaysCondition: 0,
    },
    rewardText: '',
  },

  getters: {
    showReward(state) {
      const {
        proceedStatus,
        openReward,
      } = state.userRank;

      return proceedStatus === PROCEED_STATUS.STARTED && openReward === 1;
    },

    rewardText(state) {
      const {
        proceedStatus,
        openReward,
        cumulativeCount,
        totalDaysCondition,
      } = state.userRank;

      // 如果开启了奖励
      if (proceedStatus > PROCEED_STATUS.UNSTART && openReward === 1) {
        // 如果达到奖励领取的条件
        if (cumulativeCount && cumulativeCount >= totalDaysCondition) {
          return '真棒，你已获得打卡奖励。';
        }

        // 如果打卡已结束
        if (proceedStatus === PROCEED_STATUS.ENDED) {
          return '为你的打卡精神鼓掌';
        }

        // 如果还在打卡中
        return `继续坚持${totalDaysCondition - cumulativeCount > 0
          ? totalDaysCondition - cumulativeCount : 0}天将获得奖励`;
      }

      // 如果没有开启奖励
      return '为你的打卡精神鼓掌';
    },

    rewardDialogText(state) {
      const {
        rewards,
        totalDaysCondition,
      } = state.userRank;

      let rewardText = '';
      if (rewards.length) {
        let couponCount = 0;
        let rewardPoints = '';
        rewards.forEach((reward) => {
          if (reward.rewardType === 1) { // 优惠券
            couponCount += reward.rewardCount;
          } else if (reward.rewardType === 2) { // 积分
            rewardPoints += `${reward.rewardCount}${_global.visPointsName}`;
          }
        });
        rewardText += couponCount ? `${couponCount}张优惠券` : '';
        if (rewardText.length > 0) {
          rewardText += rewardPoints ? `，${rewardPoints}` : rewardPoints;
        } else {
          rewardText += rewardPoints;
        }
      }

      return rewardText ? `打卡满${totalDaysCondition}天，奖励${rewardText}。` : '还没有设置奖励';
    },
  },

  mutations: {
    [UPDATE_USER_RANK](state, userRank) {
      state.userRank = userRank;
    },
  },

  actions: {
    fetchUserRank({ state, commit }) {
      return getPersonRank({
        alias: state.alias,
      })
        .then(res => {
          if (res) {
            commit(UPDATE_USER_RANK, res);
          }
        });
    },
  },
};
