<template>
  <div class="all-lives">
    <van-list
      v-model="isLoading"
      :finished="isFinished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoadMoreData">
      <template v-if="list.length">
        <live-item
          v-for="item in list"
          :key="item.alias"
          :item="item"
        />
      </template>
      <no-data v-else-if="isInited">
        还没有相关内容哦
      </no-data>
    </van-list>
    <salesman-cube :cube="[['weixin', 'copy', 'code', 'salesman']]" />
  </div>
</template>

<script>
import { List } from 'vant';
import NoData from '../../components/NoData';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { findPageForWym } from 'pct/api/all-lives';
import LiveItem from './components/LiveItem';
import { initComponentList } from '@youzan/h5-cpns-injector';

const [SalesmanCube] = initComponentList({
  url: '/wscvis/common/get-components.json',
  pureComponents: ['salesman-cube'],
});

export default {
  name: 'all-lives',

  config: {
    title: '全部直播',
  },

  components: {
    'van-list': List,
    LiveItem,
    NoData,
    SalesmanCube,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isInited: false,
      isLoading: false,
      isFinished: false,
      list: [],
      pageNumber: 1,
      pageTotal: 0,
      error: false,
    };
  },

  methods: {
    onLoadMoreData() {
      this.isLoading = true;
      findPageForWym({
        pageRequest: {
          pageSize: 10,
          pageNumber: this.pageNumber,
        },
      })
        .then(data => {
          this.isLoading = false;
          const { content: list = [], total = 0 } = data;
          this.list = this.list.concat(list);
          this.pageTotal = total;
          if (this.list.length >= this.pageTotal) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;

          this.isInited = true;
        })
        .catch((errMsg) => {
          this.isFinished = false;
          this.error = true;
        });
    },
  },
};
</script>

<style lang="scss">// eslint-disable-line
.all-lives {
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;

  .live-item__price-wrap {
    z-index: 0;
  }
}
</style>
