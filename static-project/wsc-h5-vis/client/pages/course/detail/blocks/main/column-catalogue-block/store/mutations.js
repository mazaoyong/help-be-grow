export default {
  total(state, total) {
    state.total = total;
  },

  next(state, next) {
    state.next = next;
  },

  lastPage(state, lastPage) {
    state.lastPage = lastPage;
  },
  SET_HAS_CUSTOM_CHAPTERS(state, payload) {
    state.hasCustomChapters = payload;
  },
  SET_CONTENT_TOTAL_COUNT(state, payload) {
    state.total = payload;
  },
  SET_SORT_TYPE_TOGGLE_BUTTON_VISIBILITY(state, visible) {
    state.sortTypeToggleButtonVisible = visible;
  },
};
