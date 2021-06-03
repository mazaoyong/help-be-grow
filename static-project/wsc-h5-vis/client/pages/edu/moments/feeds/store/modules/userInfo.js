import API from '../../apis';
import { Toast } from 'vant';
import args from '@youzan/utils/url/args.js';
const userId = args.get('userId');
const userRole = args.get('userRole');

const userInfo = {
  namespaced: true,

  state: {
    backgroundImage: '',
    avatar: '',
    userName: '',
    mobile: '',
    userId: '',

    userRole: 0,
    canPost: null,
    moduleName: '',
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
      // 如果 url 中有 userId 代表需要取不同用户的数据
      const customerId = userId;
      let userInfo = {};

      // 需要取老师的用户接口
      if (+userRole === 2) {
        const {
          coverUrl,
          icon,
          teacherName,
          staffName,
          id,
          mobile,
        } = await API.getTeacherInfo({ userId: customerId });
        userInfo = {
          coverUrl: coverUrl,
          avatar: icon,
          name: teacherName || staffName,
          userId: id,
          mobile,
        };
      } else {
        userInfo = await API.getUserInfo({ userId: customerId });
      }

      const backgroundImage = userInfo.coverUrl;
      const avatar = userInfo.avatar;
      const userName = userInfo.name;
      const userInfoUserId = userInfo.userId;
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

    // 查询用户家校圈配置
    getCeresConfig({ commit }) {
      API.getCeresConfig().then(res => {
        commit('SET_STATE', {
          canPost: res.userCanPost,
          moduleName: res.moduleName,
        });
      });
    },
  },
};

export default userInfo;
