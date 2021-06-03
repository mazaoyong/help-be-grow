import { transferClue } from 'pages-api';

const transferClueModule = {
  namespaced: true,
  state: {},
  actions: {
    findStaffPage() {
      return new Promise((resolve, reject) => {
        transferClue.FindStaffPage()
          .then(content => {
            if (content) {
              resolve(content);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findTransferReasonPage({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        transferClue.FindTransferReasonPage(data)
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
    transferClues({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        transferClue.TransferClues(data)
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

export default transferClueModule;
