import { clueList } from 'pages-api';

const clueListModule = {
  namespaced: true,
  state: {
    // 线索列表
    clueList: [],
    // 标签列表
    tagList: [],
    // 来源列表
    sourceList: [],
    // 筛选条件
    clueInfoQuery: {},

    // 日期选择类型
    clueInfoDateType: {},
  },
  actions: {
    // 获取线索列表
    fetchClueList({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueList.GetClueList(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_CLUE_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取标签列表
    fetchTagList({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueList.GetTagList(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_TAG_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取来源列表
    fetchSourceList({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueList.GetSourceList(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_SOURCE_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取校区
    findListAllCampus({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueList.FindListAllCampus(data)
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

    // 更新筛选条件
    updateClueInfoQuery({ commit }, data = {}) {
      commit('UPDATE_CLUE_INFO_QUERY', data);
    },

    // 更新日期过滤方式
    updateClueInfoDateType({ commit }, data = {}) {
      commit('UPDATE_CLUE_INFO_TYPE', data);
    },
  },

  mutations: {
    GET_CLUE_LIST(state, res) {
      state.clueList = res;
    },

    GET_TAG_LIST(state, res) {
      state.tagList = res;
    },

    GET_SOURCE_LIST(state, res) {
      state.sourceList = res;
    },

    UPDATE_CLUE_INFO_QUERY(state, data) {
      state.clueInfoQuery = data;
    },

    UPDATE_CLUE_INFO_TYPE(state, data) {
      state.clueInfoDateType = data;
    },
  },

  getters: {
    clueList(state) {
      return state.clueList;
    },
    tagList(state) {
      return state.tagList;
    },
    sourceList(state) {
      return state.sourceList;
    },
    clueInfoQuery(state) {
      return state.clueInfoQuery;
    },
    clueInfoDateType(state) {
      return state.clueInfoDateType;
    },
  },
};

export default clueListModule;
