export const mutations = {
  SET_GOODS_EXTRA_DATA(state, list = []) {
    if (list.length > 0) {
      const originExtra = state.goods.extra;
      const extra = list.reduce((data, goods) => {
        const { alias } = goods;
        data[goods.alias] = Object.assign({}, originExtra[alias], goods);
        return data;
      }, {});
      state.goods.extra = Object.assign({}, originExtra, extra);
    }
  },
};
