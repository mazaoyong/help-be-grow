import { GOODS_STATUS } from '@/constants/course/goods-status';
import { getNextOwl, getDetailSimple } from '../api';

export default {
  initNext({ rootState, commit }) {
    const current = rootState.columnProgress.alias;
    if (current) {
      const progress = rootState.contentProgress[`c-${current}`] || {};
      if (progress.percent === 100) {
        getNextOwl(current, rootState.sortType, rootState.goodsData.alias)
          .then(res => {
            if (res.alias) {
              commit('next', {
                tip: `学习下一篇：${res.title}`,
                title: res.title,
                alias: res.alias,
              });
            }
          });
      } else {
        getDetailSimple(current)
          .then(res => {
            // 判断是否定时上架
            // 直播这个状态真的迷，和 goods-parser 中的 live 相同。。。不想写枚举了，推动后端改吧
            let isPresell = false;
            if (res.content) {
              if (res.content.status === GOODS_STATUS.PRESELL) {
                isPresell = true;
              }
            }
            if (res.live) {
              if (res.live.sellTimeType === 2 && res.live.sellStatus === 2) {
                isPresell = true;
              }
            }
            if (!isPresell) {
              commit('next', {
                tip: `继续学习：${rootState.columnProgress.title}`,
                title: rootState.columnProgress.title,
                alias: current,
              });
            }
          });
      }
    }
  },

  initLastPage({ rootState, commit }) {
    commit('lastPage', rootState.columnProgress.lastPage || 1);
  },

  setTotal({ commit }, total) {
    commit('total', total);
  },
};
