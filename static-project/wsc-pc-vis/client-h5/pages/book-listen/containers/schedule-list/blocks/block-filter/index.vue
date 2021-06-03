<template>
  <div class="block-filter">
    <vis-search-list
      :no-result="!searchList.length"
      :loading="searchListLoading"
      :load-finished="searchListLoadFinished"
      @search="onSearch"
      @load-more="onLoadMore"
      @cancel="onSearchCancel"
      @type-change="onSearchCancel"
    >
      <template v-for="item in searchList">
        <div
          v-if="item.name"
          :key="item.id"
          class="search-item"
          @click="onSelectItem(item)"
        >
          {{ item.name }}
        </div>
      </template>
    </vis-search-list>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { Toast } from 'vant';
import SearchList, { SEARCH_TYPE } from '../../components/search-list';
import {
  SET_COURSE_ID,
  SET_SEARCH_CONTENT,
  SET_LESSON_NAME,
  SET_SEARCH_LIST,
} from '../../../../store/modules/schedule-list/mutation-types';

const {
  mapState,
  mapActions,
  mapMutations,
} = createNamespacedHelpers('scheduleList');

export default {
  name: 'block-filter',

  components: {
    'vis-search-list': SearchList,
  },

  data() {
    return {
      searchType: SEARCH_TYPE.COURSE,
    };
  },

  computed: {
    ...mapState({
      searchList: state => state.filter.searchList,
      searchListLoading: state => state.filter.searchListLoading,
      searchListLoadFinished: state => state.filter.searchListLoadFinished,
    }),
  },

  methods: {
    ...mapMutations({
      setSearchContent: SET_SEARCH_CONTENT,
      setCourseId: SET_COURSE_ID,
      setLessonName: SET_LESSON_NAME,
      setSearchList: SET_SEARCH_LIST,
    }),
    ...mapActions([
      'fetchCourseList',
      'fetchDaysList',
      'fetchScheduleList',
    ]),

    onSearch(searchContent, searchType) {
      this.setSearchList([]);
      if (!searchContent) {
        return Toast('请输入搜索内容');
      }
      console.log('搜索内容', searchContent, searchType);
      this.searchType = searchType;
      if (searchType === SEARCH_TYPE.COURSE) {
        this.setSearchContent(searchContent);
        this.fetchCourseList({
          refresh: true,
          type: SEARCH_TYPE.COURSE,
        });
      } else {
        this.setLessonName(searchContent);
        this.fetchScheduleList();
        this.fetchDaysList();
      }
    },

    onLoadMore() {
      console.log('搜索内容', this.searchType);
      this.fetchCourseList({
        type: SEARCH_TYPE.COURSE,
      });
    },

    onSelectItem(item) {
      console.log('选中了课程', item);
      // 设置日程列表的过滤条件 + 课程
      this.setCourseId(item.id);
      this.fetchScheduleList();
      this.fetchDaysList();
    },

    onSearchCancel() {
      console.log('点击了取消');
      // 清空选中的课程
      // 清空搜索的课节名
      // 清空搜索内容
      // 清空搜索结果列表
      // 刷新列表
      this.setCourseId('');
      this.setLessonName('');
      this.setSearchContent('');
      this.setSearchList([]);
      this.fetchScheduleList();
      this.fetchDaysList();
    },
  },
};
</script>

<style lang="postcss">
.block-filter {
  position: relative;
  z-index: 2;

  .search-item {
    padding: 0 18px;
    overflow: hidden;
    font-size: 16px;
    line-height: 54px;
    color: #323233;
    text-overflow: ellipse;
    white-space: nowrap;
    border-top: 1px solid #ebedf0;

    &:first-child {
      border-top: none;
    }
  }
}
</style>
