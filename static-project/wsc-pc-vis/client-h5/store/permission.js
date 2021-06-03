import { permission } from 'pages-api';

const permissionModule = {
  namespaced: true,
  state: {},
  actions: {
    getPermission({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        permission.getPermission(data)
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
  mutations: {},
  getters: {},
};

export default permissionModule;
