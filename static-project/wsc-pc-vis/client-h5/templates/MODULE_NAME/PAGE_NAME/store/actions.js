import { getAFromRemote } from 'sample/apis';
import { UPDATE_A } from './mutation-types';

export default {
  getAFromRemote({ state, commit, dispatch }) {
    getAFromRemote()
      .then((data) => {
        if (data) {
          commit(UPDATE_A, data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
