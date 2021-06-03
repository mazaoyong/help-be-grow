<template>
  <list-item
    class="vip-list-item"
    :url="url"
    :thumbnail-url="item.cover"
    :need-log="true"
    :log-id="item.goodsId || item.id"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
  />
</template>

<script>
import ListItem from 'pct/components/list-item';
import { formatSalesNum } from 'common/utils/hide-info';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'column-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    isPaid: Boolean,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
    url() {
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=columnshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    statusList() {
      const { item = {} } = this;

      if (this.isPaid && item.lastUpdatedInfo) return item.lastUpdatedInfo && item.lastUpdatedInfo.lastUpdatedDate;

      const list = [];
      const periodInfo = item.isUpdate ? `已更新${item.contentsCount}期` : `共${item.contentsCount}期`;
      if (item.contentsCount) list.push(periodInfo);
      const subscriptionsCount = `${formatSalesNum(item.subscriptionsCount)}人已购`;
      if (!this.isPaid && item.subscriptionsCount) list.push(subscriptionsCount);

      return list;
    },

    subtitle() {
      const {
        contentsCount,
        lastUpdatedInfo = {},
      } = this.item;

      return this.isPaid && lastUpdatedInfo && lastUpdatedInfo.lastUpdatedTitle && contentsCount
        ? `第${contentsCount}期：${lastUpdatedInfo.lastUpdatedTitle}` : this.item.summary;
    },
  },
};
</script>
