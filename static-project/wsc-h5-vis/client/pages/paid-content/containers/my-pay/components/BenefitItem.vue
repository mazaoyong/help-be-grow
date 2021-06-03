<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-tag="thumbnailTag"
    :title="item.name"
    :subtitle="subtitle"
    :status-list="statusList"
  />
</template>

<script>
import makeDateStr from '@youzan/utils/date/makeDateStr';
import ListItem from 'components/list-item';

export default {
  name: 'benefit-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      baseUrl: 'https://h5.youzan.com/v2',
    };
  },

  computed: {
    thumbnailTag() {
      if (this.item.vipCardStatus) {
        if (this.item.vipCardStatus === 1) {
          return '已过期';
        } else if (this.item.vipCardStatus === 2) {
          return '已禁用';
        }
      }
      return null;
    },

    subtitle() {
      if (this.item.contentCount <= 0 && this.item.columnCount <= 0) return '';
      const contentDesc = this.item.contentCount >= 0 ? `${this.item.contentCount}篇内容` : '';
      const columnDesc = this.item.columnCount > 0 ? `，${this.item.columnCount}篇专栏` : '';
      return `已更新${contentDesc}${columnDesc}`;
    },

    statusList() {
      return [`购买时间 ${makeDateStr(this.item.buyTime)}`];
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return `${this.baseUrl}/ump/paidcontent/index?page=vipbenefit&alias=${this.item.alias}&kdt_id=${this.kdtId}`;
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
