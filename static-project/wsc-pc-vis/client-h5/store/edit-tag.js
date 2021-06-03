import { editTag } from 'pages-api';

const editTagModule = {
  namespaced: true,
  state: {
    tagGroupList: {}, // 线索详情 - 线索学员信息和标签
  },
  actions: {
    findTagGroupPage({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        editTag.FindTagGroupPage(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_TAG_GROUP_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateClueTags({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        editTag.UpdateClueTags(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  },
  mutations: {
    GET_TAG_GROUP_LIST(state, res) {
      state.tagGroupList = res;
    },
  },
  getters: {
    tagGroupList(state) {
      return state.tagGroupList;
    },
  },
};

export default editTagModule;
