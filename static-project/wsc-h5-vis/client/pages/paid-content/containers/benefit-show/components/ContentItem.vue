<template>
  <list-item
    class="vip-list-item"
    :class="{ 'vip-content-item-free': freeText }"
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon-tag="thumbnailIconTag"
    :need-log="true"
    :log-id="item.goodsId || item.id"
    :title="item.title"
    :subtitle="item.columnTitle"
    :status-list="statusList"
    :footer-corner-text="freeText"
    footer-corner-text-class="text-red theme-btn"
  />
</template>

<script>
import ListItem from 'pct/components/list-item';
import { getMediaSuffix, formatSalesNum } from 'common/utils/hide-info';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'content-item',

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
    typeName() {
      return [
        '',
        'imgtext',
        'audio',
        'video',
      ][+this.item.mediaType];
    },

    typeSuffix() {
      return [
        '',
        '读',
        '听',
        '看',
        '看',
      ][+this.item.mediaType];
    },

    price() {
      return (this.item.price / 100).toFixed(2);
    },

    statusList() {
      const { item = {} } = this;

      const list = [];
      const pageView = `${formatSalesNum(item.pageView)}${getMediaSuffix(this.item.mediaType)}`;
      if (!this.isPaid && item.pageView) list.push(pageView);

      return list;
    },

    // 价格文字
    freeText() {
      return !this.isPaid && this.item.isFree ? `免费试${this.typeSuffix}` : '';
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=contentshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    thumbnailIconTag() {
      return [
        '',
        '图文',
        '音频',
        '视频',
      ][this.item.mediaType || 0];
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}

// 显示免费试听的时候定制一个样式
.vip-content-item-free {
  .item__status-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .item__status {
    line-height: 16px;
  }
}
</style>
