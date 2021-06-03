import { mutations } from '../constants';

const {
  UPDATE_PAY_STATE_TEXT,
  UPDATE_PAY_SUCCESS_TEXT,
  UPDATE_TIP,
  UPDATE_PAY_STATE,
  UPDATE_PAY_REWARD_INFO,
  UPDATE_ACTIVITIES_INFO,
  UPDATE_FISSION_COUPON_INFO,
  UPDATE_SHOW_RECOMMEND,
  UPDATE_BTN_LIST,
  UPDATE_BTN_UMP_MAP,
} = mutations;

export default {
  [UPDATE_TIP](state, newTip) {
    state.tip = newTip;
  },

  [UPDATE_PAY_STATE](state, newPayState) {
    state.payState = newPayState;
  },

  [UPDATE_PAY_STATE_TEXT](state, newPayStateText) {
    state.payStateText = newPayStateText;
  },

  [UPDATE_PAY_SUCCESS_TEXT](state, newPaySuccessText) {
    state.paySuccessText = newPaySuccessText;
  },

  [UPDATE_PAY_REWARD_INFO](state, newPayRewardInfo) {
    state.payRewardInfo = {
      ...state.payRewardInfo,
      ...newPayRewardInfo,
    };
  },

  [UPDATE_FISSION_COUPON_INFO](state, payload) {
    state.fissionCouponInfo = {
      ...state.fissionCouponInfo,
      ...payload,
    };
  },

  [UPDATE_ACTIVITIES_INFO](state, newActivitiesInfo) {
    if (newActivitiesInfo.length) {
      newActivitiesInfo.forEach(activity => {
        switch (activity.type) {
          case 'certificate':
            state.certInfo = {
              ...state.certInfo,
              ...activity,
            };
            break;
          case 'courseReward':
            state.rewardInfo = {
              ...state.rewardInfo,
              ...activity.data,
            };
            break;
          case 'meetReduce':
            state.presentInfo = {
              ...state.presentInfo,
              ...activity,
            };
            break;
          default:
            break;
        }
      });
    }
  },

  [UPDATE_SHOW_RECOMMEND](state, newValue) {
    state.showRecommend = newValue;
  },

  [UPDATE_BTN_LIST](state, newList) {
    state.btnList = newList;
  },

  [UPDATE_BTN_UMP_MAP](state, { key, btnInfo }) {
    state.btnUmpMap = {
      ...state.btnUmpMap,
      [key]: btnInfo,
    };
  },
};
