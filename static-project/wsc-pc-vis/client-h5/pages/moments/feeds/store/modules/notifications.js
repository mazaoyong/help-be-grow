import ajax from 'fns/ajax';
import get from 'lodash/get';
import { Toast } from 'vant';

const notifications = {
  namespaced: true,

  state: {
    messageInfo: {
      hasNewMessage: false,
    },
    errorList: {
      modifyFailMessageId: [],
      sendFailMessageId: [],
    },
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
    async getNotifications({ state, commit }, payload = {}) {
      try {
        const res = await ajax({
          loading: false,
          method: 'GET',
          url: '/v4/vis/h5/edu/moments/timeline/findMessageBox.json',
          data: payload,
        });

        commit('SET_STATE', { key: 'messageInfo', value: get(res, 'newMessage', state.messageInfo) });
        commit('SET_STATE', { key: 'errorList', value: get(res, 'censorMessage', state.errorList) });

        return res;
      } catch (err) {
        Toast.fail(err);
        Promise.reject(err);
      }
    },
  },
};

export default notifications;
