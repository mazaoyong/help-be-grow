<template>
  <van-list
    v-model="isListLoading"
    :finished="isListFinished"
    class="vispage-search-list"
    finished-text=""
    @load="onListLoad"
  >
    <div
      v-for="(item) in list"
      :key="item.alias"
      class="vispage-search-list__item"
      @click="onClickItem(item)"
    >
      {{ item.name }}
    </div>
  </van-list>
</template>
<script>
import { List, Toast } from 'vant';
import Api from '../../api';

export default {
  name: 'search-list',

  components: {
    'van-list': List,
  },

  props: {
    name: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      totalPages: 0,
      pageSize: 10,
      pageNumber: 1,
      isListLoading: false,
      isListFinished: false,
      list: [],
    };
  },

  methods: {
    onListLoad() {
      this.pageNumber++;
      this.fetchList();
    },

    fetchList(isRefresh = false) {
      if (isRefresh) {
        this.pageNumber = 1;
        this.list = [];
        this.isListFinished = false;
      }

      this.isListLoading = true;

      const {
        pageNumber,
        pageSize = 10,
      } = this;
      const name = this.$parent.keyword || '';
      return Api
        .findPageByCondition({
          pageNumber,
          pageSize,
          name,
        })
        .then(res => {
          if (!res) return;

          this.list = this.list.concat(res.content);
          this.totalPages = res.totalPages;
          if (this.pageNumber >= this.totalPages) {
            this.isListFinished = true;
          } else {
            this.isListFinished = false;
          }
          return this.list;
        })
        .catch(err => {
          console.error(err);
          Toast(err);
          this.isListFinished = true;
        })
        .finally(() => {
          this.isListLoading = false;
        });
    },

    clearList() {
      this.list = [];
    },

    onClickItem(item) {
      this.$parent.keyword = item.name && item.name.replace('\u0008', '\u0020').trim();
      this.$parent.isInput = false;
      alert('keyword', this.$parent.keyword);
      this.$emit('changeId', item);
    },
  },
};
</script>

<style lang="scss">
  .vispage-search-list {
    background-color: #fff;
    border-radius: 4px;
    margin: 10px;
    max-height: 505px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    &__item {
      box-sizing: border-box;
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20px 15px;
      border-bottom: 1px solid #ebedf0;
      font-size: 15px;
      color: #323233;

      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
