import * as Api from '../../../api';

export const actions = {
  FETCH_GOODS_EXTRA_DATA_LIST({ getters, commit }) {
    const aliases = getters.goodsList.map(({ alias }) => alias);
    return Api.getCourseList(aliases)
      .then(result => {
        if (result && result.length > 0) {
          commit('SET_GOODS_EXTRA_DATA', result);
        }
      })
      .catch(() => {});
  },

  FETCH_LIVE_EXTRA_DATA({ getters, commit }) {
    const alias = getters.singleGoods.alias;
    return Api.getLive({ alias })
      .then(result => {
        const liveResult = result && result.live;
        if (liveResult) {
          commit('SET_GOODS_EXTRA_DATA', [liveResult]);
        }
      })
      .catch(() => {});
  },
};
