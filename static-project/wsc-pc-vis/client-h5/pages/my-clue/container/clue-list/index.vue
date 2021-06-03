<template>
  <div class="clue-list-container">
    <template v-if="!isShowMultiSelect">
      <div class="clue-list-container__search">
        <clue-search
          :is-input="isSearchInput"
          @showSearchInput="onShowSearchInput"
          @doSearch="doSearch"
        />
      </div>
      <clue-filter
        v-if="!isSearchInput"
        @fetch="(clueInfoQuery, sortData) => fetchData(clueInfoQuery, sortData)"
        @multiSelect="doMultiSelect"
      />
    </template>

    <template v-if="fetched">
      <van-pull-refresh
        v-model="isRefreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-if="clueList.length > 0"
          v-model="loading"
          class="clue-list-container__list"
          :finished="finished"
          @load="fetchClueList"
        >
          <clue-item
            v-for="item in clueList"
            :key="item.clueId"
            :clue-id="item.clueId"
            :avatar="item.avatar"
            :name="item.name"
            :telephone="item.telephone"
            :revisit-time="item.revisitTime"
            :tags="item.tags"
            :phase="item.phase"
            :selected-list="selectedList"
            :is-multi-select="isShowMultiSelect"
            @itemClick="onItemClick"
          />
        </van-list>

        <empty v-else :desc="emptyDesc" />
      </van-pull-refresh>
    </template>

    <tab v-if="!isWscApp && !isShowMultiSelect && !isSearchInput" active="clueList" />
    <clue-multi-tool
      v-if="isShowMultiSelect"
      :is-select-all="isSelectAll"
      :selected-list="selectedList"
      @selectAll="onSelecAll"
      @toolClick="onToolClick"
    />
  </div>
</template>

<script>
// import { Icon } from '@youzan/vis-ui';
import { List, PullRefresh, Toast } from 'vant';
import getCurrentDay from 'zan-utils/date/getCurrentDay';
import { startOfToday, endOfToday, endOfYesterday, getTime } from 'date-fns';
import UA from '@youzan/utils/browser/ua_browser';
import tab from 'components/tab/index.vue';
import Empty from 'components/empty';
import ClueSearch from './components/ClueSearch';
import ClueFilter from './components/ClueFilter';
import ClueItem from './components/ClueItem';
import ClueMultiTool from './components/ClueMultiTool';

const defaultAvatar = 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png';

const currentDay = getCurrentDay(new Date());

const todayDateRange = {
  startTime: getTime(startOfToday(currentDay)),
  endTime: getTime(endOfToday(currentDay))
};

const fastFliterDateRange = {
  follow: {
    phase: 2
  },
  overdue: {
    revisitDateRange: {
      endTime: getTime(endOfYesterday(currentDay))
    }
  },
  visit: {
    revisitDateRange: todayDateRange
  },
  todayNew: {
    createAtDateRange: todayDateRange
  },
  todayVisit: {
    recordDateRange: todayDateRange
  }
};

export default {
  name: 'clue-list',

  components: {
    // 'vant-icon': Icon,
    'van-list': List,
    'van-pull-refresh': PullRefresh,
    ClueSearch,
    ClueFilter,
    ClueItem,
    tab,
    ClueMultiTool,
    Empty
  },

  data() {
    return {
      pageNumber: 1,
      direction: '',
      property: '',
      clueInfoQuery: {},
      clueList: [],
      finished: false,
      loading: false,
      fetched: false,
      isShowMultiSelect: false,
      selectedList: [],
      isSelectAll: false,
      isSearchInput: false,
      isRefreshing: false,
      emptyDesc: '暂无线索',
      searchType: this.$route.query.searchType || '',
      routeName: this.$route.name,
      isWscApp: UA.isWsc()
    };
  },

  beforeRouteLeave(to, from, next) {
    if (to.name === 'ClueFilter') {
      this.isShowMultiSelect = false;
      this.isSearchInput = false;
    } else {
      if (to.name !== 'ClueFilter') {
        this.$store.dispatch('clueListModule/updateClueInfoQuery', {});
      }
      this.clueList = [];
      this.pageNumber = 1;
      if (to.name === 'ClueList') {
        this.isShowMultiSelect = false;
        this.isSearchInput = false;
        // this.searchType && this.$store.dispatch('clueListModule/updateClueInfoQuery', { ...this.clueInfoQuery, ...fastFliterDateRange[this.searchType] });
      } else if (to.name === 'ClueMulti') {
        this.isShowMultiSelect = true;
        this.isSearchInput = false;
      } else {
        this.isShowMultiSelect = false;
        this.isSearchInput = true;
      }
      !this.isSearchInput && this.fetchClueList();
    }
    next();
  },

  created() {
    if (this.routeName === 'ClueList') {
      this.isShowMultiSelect = false;
      this.isSearchInput = false;
      this.searchType && this.$store.dispatch('clueListModule/updateClueInfoQuery', { ...this.clueInfoQuery, ...fastFliterDateRange[this.searchType] });
    } else if (this.routeName === 'ClueMulti') {
      this.isSearchInput = false;
      this.$store.dispatch('clueListModule/updateClueInfoQuery', {});
      this.isShowMultiSelect = true;
    } else {
      this.isShowMultiSelect = false;
      this.isSearchInput = true;
    }
    this.fetchClueList();
  },

  methods: {
    fetchClueList() {
      if (this.pageNumber === 1) this.fetched = false;
      this.clueInfoQuery = this.$store.getters['clueListModule/clueInfoQuery'] || {};
      const direction = this.direction;
      const property = this.property;
      const pageNumber = this.pageNumber;
      const data = {
        clueInfoQuery: this.clueInfoQuery,
        direction,
        property,
        pageNumber
      };

      this.$store.dispatch('clueListModule/fetchClueList', data)
        .then(res => {
          const content = res.content;
          this.clueList = this.clueList.concat(content);
          this.isRefreshing = false;
          this.loading = false;
          if (this.clueList.length < res.total) {
            this.pageNumber++;
          } else {
            this.finished = true;
          }
          this.clueList.forEach(item => {
            item.avatar = item.avatar || defaultAvatar;
          });
        })
        .finally(() => {
          this.fetched = true;
        });
    },

    onRefresh() {
      this.pageNumber = 1;
      this.clueList = [];
      this.fetchClueList();
    },

    fetchData(clueInfoQuery, sortData) {
      // this.clueInfoQuery = { ...this.clueInfoQuery, ...clueInfoQuery };
      this.clueInfoQuery = clueInfoQuery;
      this.direction = sortData.direction;
      this.property = sortData.property;
      this.pageNumber = 1;
      this.clueList = [];
      this.fetchClueList();
    },

    onShowSearchInput() {
      this.$router.push({ path: '/clue-search' });
    },

    doSearch(key) {
      this.$store.dispatch('clueListModule/updateClueInfoQuery', { key });
      this.pageNumber = 1;
      this.clueList = [];
      this.fetchClueList();
    },

    doMultiSelect() {
      this.$router.push({ path: '/clue-multi' });
    },

    onItemClick(id) {
      if (this.isShowMultiSelect) {
        if (this.selectedList.indexOf(id) > -1) {
          this.selectedList.splice(this.selectedList.indexOf(id), 1);
        } else {
          this.selectedList.push(id);
        }
        if (this.selectedList.length === this.clueList.length) {
          this.isSelectAll = true;
        }
      } else {
        // 跳转到线索详情页
        window.location.href = `/v4/vis/h5/edu/clue/clue-detail?clueId=${id}`;
      }
    },

    onSelecAll() {
      this.isSelectAll = !this.isSelectAll;
      let selectedList = [];
      if (this.isSelectAll) {
        this.clueList.forEach(item => {
          selectedList.push(item.clueId);
        });
      }
      this.selectedList = selectedList;
    },

    onToolClick(type) {
      if (this.selectedList.length > 0) {
        if (type === 'giveup') {
          window.location.href = `/v4/vis/h5/edu/clue/abandon-clue?clueIds=${encodeURIComponent(`${this.selectedList}`)}`;
        } else if (type === 'transfer') {
          window.location.href = `/v4/vis/h5/edu/clue/transfer-clue?clueIds=${encodeURIComponent(`${this.selectedList}`)}`;
        } else if (type === 'distributeToSchool') {
          this.selectSchool();
        }
      } else {
        Toast('请先选择线索');
      }
    }
  }
};
</script>

<style lang="postcss">
  .clue-list-container {
    min-height: 100vh;
    background-color: #f2f3f5;

    .van-pull-refresh__track {
      /* min-height: 100vh; */
    }

    &__list {
      margin: 10px;
      padding: 15px 15px 10px 15px;
      margin-bottom: 60px;
      background-color: #fff;
      border-radius: 4px;

      .clue-item-wrap:last-child {
        margin-bottom: 0;

        .clue-item-wrap__right:after {
          border: none;
        }
      }
    }
  }
</style>
