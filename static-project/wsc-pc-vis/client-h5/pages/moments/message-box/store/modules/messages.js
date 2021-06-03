import ajax from 'fns/ajax';
import { Toast } from 'vant';
import get from 'lodash/get';

const userInfo = {
  namespaced: true,

  state: {
    pageNumber: 1,
    pageSize: 20,
    // 用于展示的messageList
    messageList: [],
    // 暂存没有显示的messageList
    tempMessageList: [],
    // 总的messageList
    totalMessageList: [],
    hasUnReadMessage: false,
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
    async fetchMessageList({ state, commit }, payload) {
      const unReadMessageNum = get(payload, 'unReadMessageNum', state.pageSize);
      const offset = state.pageNumber === 2 ? unReadMessageNum : null;
      const pageRequest = {
        pageNumber: state.pageNumber,
        // 如果有offset说明是第二页查询已读通知，需要将pageSize改为pageSize加上pageSize - unreadMessageNum
        pageSize: state.pageNumber === 1
          ? unReadMessageNum
          : offset
            ? 2 * state.pageSize - unReadMessageNum
            : state.pageSize,
      };
      if (offset) {
        pageRequest.offset = offset;
      }
      try {
        const res = await ajax({
          loading: false,
          method: 'GET',
          url: '/v4/vis/h5/edu/moments/findUserMessages.json',
          data: {
            userRole: 2,
            pageRequest,
          },
        });
        const messageListContent = get(res, 'message.content', []);

        await commit(
          'SET_STATE',
          { key: 'messageList', value: state.messageList.concat(messageListContent) }
        );

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },
    async increasePage({ state, commit }) {
      await commit('SET_STATE', { key: 'pageNumber', value: state.pageNumber + 1 });
    },
  },
};

export default userInfo;
