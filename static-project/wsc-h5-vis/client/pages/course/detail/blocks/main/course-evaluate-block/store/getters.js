export default {
  url(state, getters, rootState) {
    return `/wscvis/edu/evaluation-list?kdt_id=${rootState.kdtId}&courseAlias=${rootState.goodsData.alias}`;
  },
};
