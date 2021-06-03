<template>
  <div class="all-columns">
    <common-list
      :request="requestData"
      error-text="请求失败，点击重新加载"
    >
      <template slot-scope="props">
        <column-item
          :item="props.item"
        />
      </template>
      <no-data slot="empty">
        还没有相关内容哦
      </no-data>
    </common-list>
    <salesman-cube :cube="[['weixin', 'copy', 'code', 'salesman']]" />
  </div>
</template>

<script>
import { CommonList } from '@youzan/vis-ui';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import apis from 'pct/api';
import NoData from '../../components/NoData';
import ColumnItem from './components/ColumnItem';
import { initComponentList } from '@youzan/h5-cpns-injector';

const [SalesmanCube] = initComponentList({
  url: '/wscvis/common/get-components.json',
  pureComponents: ['salesman-cube'],
});

export default {
  name: 'all-columns',

  config: {
    title: '全部专栏',
  },

  components: {
    ColumnItem,
    NoData,
    SalesmanCube,
    CommonList,
  },

  mixins: [mixinVisPage],

  methods: {
    requestData(params) {
      return apis.getAllColumns({
        page: params.page,
        pageSize: params.pageSize,
      }).then(data => {
        return {
          list: data.content,
          hasNext: params.page < data.totalPages,
        };
      });
    },
  },
};
</script>

<style lang="scss">
.all-columns {
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
}
</style>
