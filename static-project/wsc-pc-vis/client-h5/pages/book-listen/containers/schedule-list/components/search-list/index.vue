<template>
  <div class="search-list">
    <div class="search-list__container">
      <div class="search-list__type-selector">
        <van-dropdown-menu active-color="#00b389">
          <van-dropdown-item
            v-model="searchType"
            :options="options"
            @change="onChange"
          />
        </van-dropdown-menu>
      </div>

      <form class="search-list__input" action="/">
        <van-search
          v-model="searchContent"
          :placeholder="placeholder"
          clearable
          :show-action="showResult || !!searchContent"
          @focus="onFocus"
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
    </div>

    <div v-if="showResult" class="search-list__result">
      <div v-if="firstSearch && !loading && noResult" class="no-result">
        未找到相应的课程
      </div>
      <div v-else class="search-list__result-card">
        <van-list
          :loading="loading"
          :finished="loadFinished"
          @load="onLoadMore"
          @click.native="showResult = false"
        >
          <slot />
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { Search, List, DropdownMenu, DropdownItem } from 'vant';
import { versionWrapper } from '@/vis-shared/configs/version/fns';

export const SEARCH_TYPE = {
  COURSE: 0,
  LESSON: 1,
};
// const SEARCH_TYPE_TEXT = {
//   [SEARCH_TYPE.COURSE]: '课程',
//   [SEARCH_TYPE.LESSON]: '课节',
// };

export default {
  name: 'search-list',

  components: {
    'van-search': Search,
    'van-list': List,
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
  },

  props: {
    noResult: Boolean,
    loading: Boolean,
    loadFinished: Boolean,
  },

  data() {
    const options = versionWrapper('scheduleSearchTypes', [
      { text: '课程', value: SEARCH_TYPE.COURSE },
      { text: '课节', value: SEARCH_TYPE.LESSON },
    ]);

    return {
      firstSearch: false,
      showResult: false,
      searchType: options[0] && options[0].value,
      searchContent: '',
      options,
    };
  },

  computed: {
    placeholder() {
      return '请输入';
    },
  },

  methods: {
    onSearch: debounce(function(searchContent) {
      this.searchContent = searchContent;
      this.$emit('search', searchContent, this.searchType);
      this.firstSearch = true;
    }, 500),

    onChange(value) {
      this.searchType = value;
      this.searchContent = '';
      if (value === SEARCH_TYPE.LESSON) {
        this.showResult = false;
      }
      this.$emit('type-change');
    },

    onLoadMore() {
      this.$emit('load-more');
    },

    onCancel() {
      this.showResult = false;
      this.$emit('cancel');
    },

    onFocus() {
      if (this.searchType === SEARCH_TYPE.COURSE) {
        this.showResult = true;
      }
    },
  },
};
</script>

<style lang="postcss">
.search-list {

  &__container {
    display: flex;
  }

  &__input {
    flex: 1 1 auto;

    .van-search {
      padding-left: 0;
    }
  }

  &__type-selector {
    flex: 0 0 70px;
    height: 54px;
    padding: 10px 0 10px 12px;
    background: #fff;

    .van-dropdown-menu {

      &:after {
        border-width: 0;
      }
    }

    .van-dropdown-menu__item {
      height: 34px;
      padding-right: 6px;
      background: #f7f8fa;
      border-radius: 2px 0 0 2px;
    }

    .van-dropdown-menu__title {
      padding: 0 18px 0 14px;
      font-size: 12px;
    }
  }

  &__result {
    position: fixed;
    top: 54px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    padding-bottom: 10px;
    background: #f7f8fa;

    &-card {
      max-height: calc(100% - 20px);
      margin: 10px;
      overflow: auto;
      background: #fff;
      border-radius: 4px;
    }

    .no-result {
      margin-top: 80px;
      font-size: 14px;
      line-height: 18px;
      color: #aaabad;
      text-align: center;
    }
  }
}
</style>
