<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon-tag="thumbnailIconTag"
    :need-log="true"
    :log-id="item.goodsId || item.id"
    :title="item.title"
  >
    <recommend-item-price slot="footer-left" :price="priceText" />
  </list-item>
</template>

<script>
import ListItem from 'pct/components/list-item';
import RecommendItemPrice from './goods-recommends/RecommendItemPrice';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'item-content',

  components: {
    ListItem,
    RecommendItemPrice,
  },

  props: {
    item: Object,
    isRecommends: Boolean,
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

    statusList() {
      if (this.isRecommends) return [];

      const list = [];
      const suffix = ['', '读', '听', '看', '看'];
      if (this.item.sales) list.push(this.item.sales + '人已' + suffix[this.item.mediaType]);
      return list;
    },

    subtitle() {
      if (this.isRecommends) return this.item.summary;

      return this.item.publishAtStr;
    },

    priceText() {
      if (this.isRecommends) return `${(this.item.price / 100).toFixed(2)}`;
      return '';
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
</style>
