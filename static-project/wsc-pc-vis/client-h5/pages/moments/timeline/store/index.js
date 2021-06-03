import Vuex from 'vuex';
import Vue from 'vue';
import get from 'lodash/get';
import { Toast } from 'vant';
import args from '@youzan/utils/url/args.js';
import api from '../api';
import userInfo from '../../feeds/store/modules/userInfo';

Vue.use(Vuex);

const userId = args.get('userId');
const userRole = args.get('userRole');
const store = new Vuex.Store({
  state: {
    feedList: [],
    totalPages: 1,
    pageNumber: 1,
    pageSize: 20,
  },

  mutations: {
    /**
     * 更新数据
     * @param {Object} state 原有的数据
     * @param {{key: string; value: any}} payload 需要更新的数据
     * @return {undefined}
     */

    SET_STATE(state, payload) {
      const { key, value } = payload;
      const originVal = state[key];
      if (originVal !== value) {
        state[key] = value;
      }
    },
  },

  actions: {
    async fetchFeedList({ state, commit }, payload = {}) {
      try {
        const data = {
          pageRequest: {
            pageNumber: payload.pageNumber || state.pageNumber,
            pageSize: payload.pageSize || state.pageSize,
          },
          viewed: {
            userId,
            userRole,
          },
        };
        const res = await api.findPostsForStaff(data);
        const content = get(res, 'content', []);

        content.forEach(feed => {
          if (!feed.likedUsers) feed.likedUsers = [];
          feed.showEditMore = false;
        });

        const feedList = state.feedList.concat(content);
        const totalPages = get(res, 'totalPages', state.totalPages);
        await commit('SET_STATE', { key: 'totalPages', value: totalPages });
        await commit('SET_STATE', { key: 'feedList', value: feedList });

        return content;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },

    async increasePageNumber({ state, commit }) {
      await commit('SET_STATE', { key: 'pageNumber', value: state.pageNumber + 1 });
    },
  },
  modules: {
    userInfo,
  },
});

export default store;
