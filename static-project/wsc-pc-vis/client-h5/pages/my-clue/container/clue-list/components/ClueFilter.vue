<template>
  <div class="clue-filter-wrap">
    <div
      class="clue-filter-wrap__sort"
      @click="onShowSortType">
      <span>{{ selectedOption.label }}</span>
      <van-icon :name="iconName" size="14px" color="#00b389" />
    </div>
    <div class="clue-filter-wrap__right">
      <div
        class="clue-filter-wrap__right-filter"
        :class="{ 'active': isFilterActive }"
        @click="onShowFilterPop">
        <span>筛选</span>
        <van-icon name="filter-o" size="14px" :color="isFilterActive ? '#00b389' : '#323233'" />
      </div>
      <div
        class="clue-filter-wrap__right-multi"
        @click="onMultiSelect"
      >
        <span>多选</span>
      </div>
    </div>

    <!-- sort type popup -->
    <van-popup
      v-model="showSortPop"
      class="clue-filter-wrap__sort-pop"
      overlay-class="clue-filter-wrap__sort-pop-overlay"
      :close-on-click-overlay="false">
      <div>
        <div
          :class="['clue-filter-wrap__sort-pop-sort', selectedOption.id === item.id ? 'checked' : '']"
          v-for="(item, index) in sortOptions"
          :key="index"
          @click="onChangeSortType(item)">
          <span>{{ item.label }}</span>
          <van-icon :name="selectedOption.id === item.id ? 'success' : ''" size="14px" color="#00b389" />
        </div>
      </div>
    </van-popup>

    <!-- filter type popup -->
    <van-popup
      v-model="isShowFilterPop"
      class="clue-filter-wrap__filter-pop"
      position="right"
    >
      <clue-filter-options
        v-if="fetchedTag && fetchedSource"
        :tag-list="tagList"
        :source-list="sourceList"
        @search="val => onSearch(val)"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon } from 'vant';
import { clueList } from '../../../../../pages-api/index';

export default {
  name: 'clue-filter',

  components: {
    // 'vis-icon': Icon,
    'van-popup': Popup,
    'van-icon': Icon,
  },

  data() {
    return {
      sortOptions: [
        {
          id: 0,
          type: 'record_updated_at',
          label: '动态更新时间倒序',
          direction: 'DESC',
        },
        {
          id: 1,
          type: 'record_updated_at',
          label: '动态更新时间正序',
          direction: 'ASC',
        },
        {
          id: 2,
          type: 'revisit_time',
          label: '回访时间正序',
          direction: 'ASC',
        },
        {
          id: 3,
          type: 'revisit_time',
          label: '回访时间倒序',
          direction: 'DESC',
        },
        {
          id: 4,
          type: 'created_at',
          label: '创建时间',
          direction: 'ASC',
        },
      ],
      iconName: 'arrow-down',
      selectedOption: {
        id: 0,
        type: 'recordUpdated_at',
        label: '动态更新时间倒序',
        direction: 'DESC',
      },
      // selectedOption: '动态更新时间倒序',
      showSortPop: false,
      isShowFilterPop: false,
      tagList: [],
      tagPageNumber: 1,
      sourceList: [],
      sourcePageNumber: 1,
      pageSize: 10,
      fetchedTag: false,
      fetchedSource: false,
      sortQuery: {
        direction: '',
        property: '',
      },
      clueInfoQuery: {
        /* phase: 0,
        createAtDateRange: {},
        revisitDateRange: {},
        recordDateRange: {},
        sourceId: 0,
        tags: [], */
      },
    };
  },

  computed: {
    isFilterActive() {
      return Object.keys(this.$store.getters['clueListModule/clueInfoQuery']).length > 0;
    },
  },

  methods: {
    onShowSortType() {
      this.showSortPop = !this.showSortPop;
      this.iconName = this.showSortPop ? 'arrow-up' : 'arrow-down';
    },

    onChangeSortType(item) {
      this.showSortPop = false;
      this.iconName = 'arrow-down';
      this.selectedOption = item;
      this.sortQuery.property = item.type;
      this.sortQuery.direction = item.direction;
      this.$emit('fetch', this.clueInfoQuery, this.sortQuery);
    },

    onShowFilterPop() {
      /* this.fetchTagList();
      this.fetchSourceList();
      this.isShowFilterPop = true; */
      this.$router.push({ path: '/clue-filter', query: {} });
    },

    fetchTagList() {
      clueList
        .GetTagList({
          pageNumber: this.tagPageNumber,
          pageSize: this.pageSize,
        })
        .then((res = {}) => {
          const content = res.content || [];
          const total = res.total;
          this.tagList = this.tagList.concat(content);
          if (this.tagList < total) {
            this.tagPageNumber++;
            this.fetchTagList();
          }
        })
        .then(() => {
          this.fetchedTag = true;
        });
    },

    fetchSourceList() {
      clueList
        .GetSourceList({
          pageNumber: this.sourcePageNumber,
          pageSize: this.pageSize,
        })
        .then((res = {}) => {
          const content = res.content || [];
          const total = res.total;
          this.sourceList = this.sourceList.concat(content);
          if (this.sourceList < total) {
            this.sourcePageNumber++;
            this.fetchSourceList();
          }
        }).then(() => {
          this.fetchedSource = true;
        });
    },

    onSearch(data) {
      this.isShowFilterPop = false;
      // this.clueInfoQuery = { ...this.clueInfoQuery, ...data };
      this.clueInfoQuery = data;
      this.$emit('fetch', this.clueInfoQuery, this.sortQuery);
    },

    onMultiSelect() {
      this.$emit('multiSelect');
    },
  },
};
</script>

<style lang="postcss">
.clue-filter-wrap {
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 20px;
  padding: 15px;
  justify-content: space-between;
  background-color: #fff;
  font-size: 14px;

  &__sort {
    flex: 1;
    color: #00b389;

    .van-icon {
      margin-left: 5px;
      vertical-align: middle;
    }
  }

  &__right {
    flex: 1;
    color: #323233;
    text-align: right;

    div {
      display: inline-block;
      text-align: right;
    }

    &-filter {
      padding-right: 20px;

      &.active {
        color: #00b389;
      }

      span {
        margin-right: 5px;
        vertical-align: text-bottom;
      }
    }

    &-multi {
      position: relative;
      padding-left: 20px;
      vertical-align: text-bottom;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        transform: scale(.5);
        transform-origin: 0 0;
        pointer-events: none;
        box-sizing: border-box;
        border-left: 1px solid #d8d8d8;
      }
    }
  }

  &__sort-pop {
    top: 207px;
    width: 101%;
    padding: 15px 15px 0;
    transition: none;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      border-top: 1px solid #d8d8d8;
      }

    &-sort {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #323233;

      &.checked {
        color: #00b389;
      }
    }
    &-overlay {
      top: 100px;
    }
  }

  &__filter-pop {
    top: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 4px;
    background-color: #f2f3f5;
    transform: none;
  }
}
</style>
