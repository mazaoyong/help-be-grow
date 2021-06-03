import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export default {
  inviteMap(state, getters, rootState) {
    const canInvite = (() => {
      return rootState.activityTypes.includes(ACTIVITY_TYPE.INVITE) && !!rootState.activityData.isDistribution;
    })();

    const maxInviteProfit = (() => {
      if (canInvite) {
        return rootState.activityData.distributionMoney;
      }
      return 0;
    })();

    return {
      isSupport: canInvite,
      maxProfit: maxInviteProfit || 0,
    };
  },
  show(state, getters, rootState, rootGetters) {
    const { register } = state;
    const { inviteMap } = getters;
    const { env } = rootState;
    const { isOnlineCourse } = rootGetters;

    if (!inviteMap.isSupport) {
      return false;
    }
    if (env.isGuang) {
      return false;
    }
    if (isOnlineCourse && env.isIOSWeapp) {
      return false;
    }
    if (!register) {
      return false;
    }
    return true;
  },
};
