import API from '../../apis';
import { Toast } from 'vant';
import args from '@youzan/utils/url/args.js';
const userId = args.get('userId');

const userInfo = {
  namespaced: true,

  state: {
    backgroundImage: '',
    avatar: '',
    userName: '',
    userId: '',
    mobile: '',
    userRole: 2,
  },

  mutations: {
    /**
     * 更新数据
     * @param {Object} state 原有的数据
     * @param {{key: string; value: any}} payload 需要更新的数据
     * @return {undefined}
     */

    SET_STATE(state, payload) {
      const keys = Object.keys(payload || {});
      if (keys.length) {
        keys.forEach(key => {
          const originVal = state[key];
          const val = payload[key];
          if (originVal !== val) {
            state[key] = val;
          }
        });
      }
    },
  },

  actions: {
    async initUserInfo({ commit }) {
      const teacherId = userId;
      const userInfo = await API.getTeacherInfo({ teacherId });
      const backgroundImage = userInfo.coverUrl;
      const avatar = userInfo.icon;
      const userName = userInfo.teacherName || userInfo.staffName;
      const userInfoUserId = userInfo.id;
      const mobile = userInfo.mobile;

      await commit('SET_STATE', { backgroundImage, avatar, userName, userId: userInfoUserId, mobile });
    },

    updateCover({ commit }, { coverUrl }) {
      API.updateCover({ coverUrl: coverUrl.url, resourceId: coverUrl.imgId })
        .then(res => {
          commit('SET_STATE', {
            backgroundImage: coverUrl.url,
          });
        })
        .catch(err => {
          Toast(err);
        });
    },
  },
};

export default userInfo;
