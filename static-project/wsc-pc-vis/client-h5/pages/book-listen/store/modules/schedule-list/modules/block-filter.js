import {
  getCourseList,
} from '../../../../apis/schedule-list';
import {
  SET_SEARCH_CONTENT,
  SET_SEARCH_FINISHED,
  SET_FILTER_PAGE_NUMBER,
  SET_SEARCH_LOADING,
  SET_SEARCH_LIST,
  SET_LESSON_NAME,
  SET_COURSE_ID,
} from '../mutation-types';

const DEFAULT_PAGE_SIZE = 20;

export default {
  state: {
    searchContent: '',
    searchList: [],
    pageNumber: 1,
    searchListLoading: false,
    searchListLoadFinished: false,
  },

  mutations: {
    [SET_SEARCH_CONTENT](state, searchContent) {
      state.searchContent = searchContent;
    },
    [SET_SEARCH_FINISHED](state, searchListLoadFinished) {
      state.searchListLoadFinished = searchListLoadFinished;
    },
    [SET_FILTER_PAGE_NUMBER](state, pageNumber) {
      state.pageNumber = pageNumber;
    },
    [SET_SEARCH_LOADING](state, searchListLoading) {
      state.searchListLoading = searchListLoading;
    },
    [SET_SEARCH_LIST](state, searchList) {
      state.searchList = searchList;
    },
  },

  actions: {
    resetFilter({ commit }) {
      commit(SET_SEARCH_CONTENT, '');
      commit(SET_LESSON_NAME, '');
      commit(SET_COURSE_ID, '');
      commit(SET_SEARCH_LIST, []);
    },

    fetchCourseList({ state, commit }, { refresh = false, type = '' }) {
      if (state.searchListLoading) return;
      if (refresh) commit(SET_SEARCH_FINISHED, false);
      commit(SET_SEARCH_LOADING, true);

      const query = {
        pageRequest: {
          pageNumber: refresh ? 1 : state.pageNumber,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        query: {
          name: state.searchContent,
        },
      };
      getCourseList(query)
        .then(res => {
          if (res && res.content) {
            if (refresh) {
              commit(SET_SEARCH_LIST, [...res.content]);
            } else {
              commit(SET_SEARCH_LIST, [...state.searchList, ...res.content]);
            }

            if (res.totalPages <= state.pageNumber) {
              commit(SET_SEARCH_FINISHED, true);
            } else {
              commit(SET_FILTER_PAGE_NUMBER, state.pageNumber + 1);
            }
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          commit(SET_SEARCH_LOADING, false);
        });
    },
  },
};
