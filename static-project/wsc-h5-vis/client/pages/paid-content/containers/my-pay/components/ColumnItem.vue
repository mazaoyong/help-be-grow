<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
  />
</template>

<script>
import format from 'date-fns/format';
import ListItem from 'components/list-item';
import { ACTIVITY_TYPE } from 'pct/constants';

export default {
  name: 'column-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
    url() {
      // 连锁进店逻辑需要的url
      return this.item.columnDetailUrl;
    },

    statusList() {
      const time = format(this.item.subCreateTime, 'YYYY-MM-DD');
      if (this.isGift) return [`领取时间：${time}`];

      return [`购买时间：${time}`];
    },

    subtitle() {
      const { item = {} } = this;

      if (this.isGift) return `${item.fromUserName || '匿名用户'}请你看`;

      return item.isUpdate ? `已更新${item.contentsCount}期` : `共${item.contentsCount}期`;
    },

    isGift() {
      return this.item.channelType === ACTIVITY_TYPE.PERSENT_GIFT ||
        this.item.channelType === ACTIVITY_TYPE.INVITE_FRIEND;
    },
  },
};
</script>
