<template>
  <div class="all-contents">
    <common-list
      :request="requestData"
      error-text="请求失败，点击重新加载"
    >
      <template slot-scope="props">
        <content-item
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
import ContentItem from './components/ContentItem';
import { initComponentList } from '@youzan/h5-cpns-injector';

const [SalesmanCube] = initComponentList({
  url: '/wscvis/common/get-components.json',
  pureComponents: ['salesman-cube'],
});

export default {
  name: 'all-contents',

  config: {
    title: '全部内容',
  },

  components: {
    CommonList,
    ContentItem,
    NoData,
    SalesmanCube,
  },

  mixins: [mixinVisPage],

  methods: {
    requestData(params) {
      return apis.getAllContents({
        page_no: params.page,
      }).then(data => {
        return {
          list: data.list,
          hasNext: params.page * params.pageSize < data.total,
        };
      });
    },
  },
};
</script>

<style lang="scss">
.all-contents {
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
}
</style>
