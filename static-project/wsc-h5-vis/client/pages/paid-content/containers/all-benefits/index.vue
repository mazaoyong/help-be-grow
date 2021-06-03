<template>
  <div class="all-benefits">
    <van-list
      v-model="isLoading"
      :finished="isFinished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoadMoreData"
    >
      <template v-if="list.length">
        <benefit-item
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
import mixinVisPage from 'common/mixins/mixin-vis-page';
import apis from 'pct/api';
import NoData from '../../components/NoData';
import BenefitItem from './components/BenefitItem';
import { initComponentList } from '@youzan/h5-cpns-injector';

const [SalesmanCube] = initComponentList({
  url: '/wscvis/common/get-components.json',
  pureComponents: ['salesman-cube'],
});

export default {
  name: 'all-benefits',

  config: {
    title: '全部会员权益',
  },

  components: {
    'van-list': List,
    NoData,
    BenefitItem,
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
      apis.getAllBenefits({
        pageNumber: this.pageNumber,
        pageSize: 20,
      })
        .then(data => {
          this.isLoading = false;
          const { items = [], paginator: { totalCount = 0 } } = data;
          this.list = this.list.concat(items);
          this.pageTotal = totalCount;
          if (this.list.length >= this.pageTotal) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;

          this.isInited = true;
        })
        .catch(() => {
          this.error = true;
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.all-benefits {
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
}
</style>
