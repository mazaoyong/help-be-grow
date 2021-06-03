import { getFreeContentAndLive } from '../api';

export default {
  fetchList({ commit, state, rootState }) {
    const { isOwnAsset, alias } = rootState.goodsData;
    commit('loading', true);
    if (!isOwnAsset) {
      getFreeContentAndLive(alias, state.sortType)
        .then(res => {
          commit('loading', false);
          commit('list', res.freeContents || []);
          commit('columnFreeContentCount', res.total || 0, { root: true });
        })
        .catch(() => {
          commit('loading', false);
        });
    }
  },

  toggleSortType({ commit, state }) {
    if (state.sortType === 'desc') {
      commit('sortType', 'asc');
    } else {
      commit('sortType', 'desc');
    }
  },
};
