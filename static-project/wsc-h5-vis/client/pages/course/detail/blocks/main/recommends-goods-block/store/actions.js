import { get } from 'lodash';
import { recommend } from '../api';

export default {
  init({ rootState, commit }) {
    if (rootState.goodsData.isOwnAsset) {
      recommend(rootState.goodsData.alias, rootState.goodsData.column.alias)
        .then(res => {
          const list = [];
          const owlModule = res.owlModule || {};
          const nonOwlModule = res.nonOwlModule || {};
          const owlList = owlModule.recommends || [];
          const goodsList = nonOwlModule.recommends || [];
          owlList.sort((item1, item2) => item2.serialNo - item1.serialNo);
          goodsList.sort((item1, item2) => item2.serialNo - item1.serialNo);
          if (owlList.length) {
            list.push(owlModule);
          }
          if (goodsList.length) {
            list.push(nonOwlModule);
          }
          commit('list', list.sort((item1, item2) => item1.serialNo - item2.serialNo));
          commit('audioOrVideoPlayEndRecommendGoods', get(res, 'singleModule.recommends[0]', null), { root: true });
        });
    }
  },
};
