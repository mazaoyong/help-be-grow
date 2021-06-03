<template>
  <list-item
    :thumbnail-url="item.cover"
    :title="item.title"
    :subtitle="item.summary"
    :status-list="statusList"
    :header-corner-text="`￥${price}`"
    :header-corner-tag="activityTag"
    :footer-corner-text="`x${count}`"
    :use-points="usePoints"
    :points-info="pointsPrice"
  />
</template>

<script>
import ListItem from 'components/list-item';
import MixinItem from './mixins/mixin-item';

export default {
  name: 'item-column',

  components: {
    ListItem,
  },

  mixins: [MixinItem],

  props: {
    item: Object,
    price: String,
    activityTag: String,
    count: Number,
    pointsInfo: Object,
  },

  computed: {
    statusList() {
      const { item = {} } = this;

      const list = [];
      const contentsCount = `已更新${item.contentsCount}期`;
      if (item.contentsCount) list.push(contentsCount);
      const subscriptionsCount = `${item.subscriptionsCount}人已购`;
      if (item.subscriptionsCount) list.push(subscriptionsCount);

      return list;
    },
  },
};
</script>
