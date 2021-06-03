import { abandonClue } from 'pages-api';

const abandonClueModule = {
  namespaced: true,
  state: {},
  actions: {
    giveUpClues({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        abandonClue.GiveUpClues(data)
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

export default abandonClueModule;
