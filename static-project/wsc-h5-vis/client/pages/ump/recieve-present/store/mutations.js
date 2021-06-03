export default {
  startFetch(state) {
    state.loading = true;
  },

  errorFetch(state) {
    state.success = false;
  },

  endFetch(state) {
    state.loading = false;
  },

  setList(state, list) {
    state.list = list;
  },
};
