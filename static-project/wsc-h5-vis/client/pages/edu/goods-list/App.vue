<template>
  <vis-page-container>
    <div class="goods-list">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="fetchGoodsList"
      >
        <goods-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :thumb-url="item.cover"
          :price="item.price"
          :subscription-count="item.subscriptionCount"
          :page-view="item.pageView"
          :url="item.url"
          :type="item.type"
          :media-type="item.mediaType"
          :show-price="!((item.type === 2 || item.type === 4) && item.sellerType === 2)"
        />
      </van-list>
      <no-course v-if="hasLoaded && list.length===0" class="no-data" :desc="'还没有相关内容哦'" />
    </div>
  </vis-page-container>
</template>

<script>
import { List, Toast } from 'vant';
import PageContainer from '../components/page-container';
import NoCourse from '../components/no-course';
import api from './api.js';
import GoodsItem from './components/GoodsItem.vue';

export default {
  name: 'goods-list',
  components: {
    'vis-page-container': PageContainer,
    'van-list': List,
    'goods-item': GoodsItem,
    NoCourse,
  },

  data() {
    return {
      list: [],
      pageable: {
        index: 1,
        size: 10,
        property: 'created_at',
        direction: 'DESC',
      },
      loading: false,
      finished: false,
      error: false,
      hasLoaded: false,
    };
  },

  computed: {
    kdtId() {
      return window._global.kdt_id || '';
    },
  },

  methods: {
    fetchGoodsList() {
      const { pageable } = this;

      this.loading = true;
      api.fetchGoodsList({
        pageNumber: pageable.index,
        pageSize: pageable.size,
        direction: pageable.direction,
        property: pageable.property,
        kdtId: this.kdtId,
        types: '10,1,2,4',
      }).then(res => {
        const { list, pageable } = this;
        const { content = [], total = 0 } = res;
        list.splice(list.length, 0, ...content);
        this.loading = false;
        this.hasLoaded = true;
        pageable.index++;

        if (total <= list.length) {
          this.finished = true;
        }
      }).catch(err => {
        Toast(err || '未知错误');
        this.loading = false;
        this.finished = true;
        this.hasLoaded = true;
      });
    },
  },
};
</script>
<style scoped lang="scss">
  .no-data {
    padding:87px 0;
  }
</style>
