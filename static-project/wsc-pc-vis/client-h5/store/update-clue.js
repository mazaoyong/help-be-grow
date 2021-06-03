import { updateClue } from 'pages-api';

const updateClueModule = {
  namespaced: true,
  state: {
    attributes: [],
    sourceId: 0,
  },
  actions: {
    findAttributeItemsByKdtId({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        updateClue.FindAttributeItemsByKdtId(data)
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
    findSourceGroupPage({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        updateClue.FindSourceGroupPage(data)
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
    getAttributesById({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        updateClue.GetAttributesById(data)
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
    create({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        updateClue.Create(data)
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
    update({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        updateClue.Update(data)
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
    setAttributes({ commit }, data = []) {
      commit('SET_ATTRIBUTES', data);
    },
    setSourceId({ commit }, sourceId) {
      commit('SET_SOURCE_ID', sourceId);
    },
    getRemoteConf() {
      return updateClue.GetRemoteConf();
    },
  },
  mutations: {
    SET_ATTRIBUTES(state, data) {
      state.attributes = data;
    },
    SET_SOURCE_ID(state, sourceId) {
      state.sourceId = sourceId;
    },
  },
  getters: {
    attributes(state) {
      return state.attributes;
    },
    sourceId(state) {
      return state.sourceId;
    },
  },
};

export default updateClueModule;
