import { ajax } from '@youzan/vis-ui';
import get from 'lodash/get';
import { Toast } from 'vant';
import apis from '../../apis';

async function findComments(feed) {
  const {
    postId,
    comments: {
      content,
      pageable,
      totalPages,
    },
  } = feed;
  let commentsList = content;

  if (pageable) {
    const { pageNumber, pageSize } = pageable;
    for (let i = pageNumber + 1; i <= totalPages; i++) {
      const l = await apis.findComments({
        postId,
        pageRequest: {
          pageNumber: i,
          pageSize,
        },
      });
      commentsList = commentsList.concat(l.content);
    }

    return {
      content: commentsList,
      numberOfElements: commentsList.length,
      total: commentsList.length,
    };
  } else {
    return feed.comments;
  }
}

const feeds = {
  namespaced: true,

  state: {
    feedList: [],
    totalPages: 1,
    pageNumber: 1,
    pageSize: 10,
    postDetail: {},

    showEditMoreId: -1,
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
        const res = await ajax({
          loading: false,
          method: 'GET',
          url: '/wscvis/edu/moments/feeds/getFeedList.json',
          data: {
            pageRequest: {
              pageNumber: payload.pageNumber || state.pageNumber,
              pageSize: payload.pageSize || state.pageSize,
            },
          },
        });

        const content = get(res, 'content', []);
        // make `likedUsers` observable
        content.forEach(async feed => {
          if (!feed.likedUsers) feed.likedUsers = [];
          feed.comments = await findComments(feed);
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

    async deleteFeed({ state, commit }, payload = {}) {
      const postId = payload.postId;
      const feedList = state.feedList;
      feedList.splice(feedList.findIndex(f => f.postId === postId), 1);
      await commit('SET_STATE', { key: 'feedList', value: feedList });
    },

    async getPostDetail({ commit }, payload = {}) {
      const { postId } = payload;
      if (postId !== undefined) {
        try {
          const res = await ajax({
            method: 'GET',
            url: '/wscvis/edu/moments/findPostDetail.json',
            data: {
              postId,
            },
          });
          // make `likedUsers` observable
          if (!res.likedUsers) res.likedUsers = [];
          res.comments = await findComments(res);

          await commit('SET_STATE', { key: 'postDetail', value: res });

          return res;
        } catch (err) {
          Toast.fail(err);
          Promise.reject(err);
        }
      }
    },

    async handleEditMore({ state, commit }, payload = {}) {
      let postId = payload.postId;
      if (state.showEditMoreId !== -1) {
        postId = -1;
      }
      await commit('SET_STATE', { key: 'showEditMoreId', value: postId });
    },

    async resetEditMore({ state, commit }) {
      if (state.showEditMoreId === -1) {
        return;
      }
      await commit('SET_STATE', { key: 'showEditMoreId', value: -1 });
    },

    async createLike({ state, commit }, payload = {}) {
      try {
        const postId = payload.postId;
        const res = await apis.createLike(payload).then(() => ajax({
          method: 'GET',
          url: '/wscvis/edu/moments/findPostDetail.json',
          data: {
            postId,
          },
        }));

        const feedList = state.feedList;
        const index = feedList.findIndex(f => f.postId === postId);

        // 当前页面为 feeds/detail
        if (index === -1) {
          const feed = state.postDetail;
          feed.isLiked = res.isLiked;
          feed.likedUsers = res.likedUsers;
          await commit('SET_STATE', { key: 'postDetail', value: feed });
        } else {
          feedList[index].isLiked = res.isLiked;
          feedList[index].likedUsers = res.likedUsers;
          await commit('SET_STATE', { key: 'feedList', value: feedList });
        }

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },

    async deleteLike({ state, commit }, payload = {}) {
      try {
        const postId = payload.postId;
        const res = await apis.deleteLike(payload).then(() => ajax({
          method: 'GET',
          url: '/wscvis/edu/moments/findPostDetail.json',
          data: {
            postId,
          },
        }));

        const feedList = state.feedList;
        const index = feedList.findIndex(f => f.postId === postId);
        // 当前页面为 feeds/detail
        if (index === -1) {
          const feed = state.postDetail;
          feed.isLiked = res.isLiked;
          feed.likedUsers = res.likedUsers;
          await commit('SET_STATE', { key: 'postDetail', value: feed });
        } else {
          feedList[index].isLiked = res.isLiked;
          feedList[index].likedUsers = res.likedUsers;
          await commit('SET_STATE', { key: 'feedList', value: feedList });
        }

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },

    async createComment({ state, commit }, payload = {}) {
      try {
        const postId = payload.postId;
        const res = await apis.createComment(payload).then(() => ajax({
          method: 'GET',
          url: '/wscvis/edu/moments/findPostDetail.json',
          data: {
            postId,
          },
        }));

        const feedList = state.feedList;
        const index = feedList.findIndex(f => f.postId === postId);
        // 当前页面为 feeds/detail
        if (index === -1) {
          const feed = state.postDetail;
          feed.comments = await findComments(res);
          await commit('SET_STATE', { key: 'postDetail', value: feed });
        } else {
          feedList[index].comments = await findComments(res);
          await commit('SET_STATE', { key: 'feedList', value: feedList });
        }

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },

    async deleteComment({ state, commit }, payload = {}) {
      try {
        const postId = payload.postId;
        const res = await apis.deleteComment(payload).then(() => ajax({
          method: 'GET',
          url: '/wscvis/edu/moments/findPostDetail.json',
          data: {
            postId,
          },
        }));

        const feedList = state.feedList;
        const index = feedList.findIndex(f => f.postId === postId);

        // 当前页面为 feeds/detail
        if (index === -1) {
          const feed = state.postDetail;
          feed.comments = await findComments(res);
          await commit('SET_STATE', { key: 'postDetail', value: feed });
        } else {
          feedList[index].comments = await findComments(res);
          await commit('SET_STATE', { key: 'feedList', value: feedList });
        }

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },
  },
};

export default feeds;
