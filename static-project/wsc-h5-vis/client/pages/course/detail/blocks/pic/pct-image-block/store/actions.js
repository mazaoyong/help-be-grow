import getNetworkType from '@/pages/course/detail/utils/get-network-type';
import { PLAY_STATUS } from '../constants';

export default {
  initNetworkType({ commit }) {
    getNetworkType().then(networkType => {
      commit('networkType', networkType);
    });
  },

  start({ commit }) {
    commit('playStatus', PLAY_STATUS.PLAYING);
    commit('willFinish', false);
    commit('cancelNext', false);
  },

  end({ commit }) {
    commit('playStatus', PLAY_STATUS.AFTER_PLAY);
  },

  reset({ commit }) {
    commit('playStatus', PLAY_STATUS.BEFORE_PLAY);
    commit('willFinish', false);
    commit('cancelNext', false);
  },
};
