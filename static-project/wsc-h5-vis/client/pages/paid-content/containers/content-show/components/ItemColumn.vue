<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    thumbnail-icon-tag="专栏"
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
  name: 'item-column',

  components: {
    ListItem,
    RecommendItemPrice,
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
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=columnshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    // 价格
    priceText() {
      if (this.item.price) return `${((this.item.price || 0) / 100).toFixed(2)}`;
      return this.item.price;
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.recommend-item__price {

  &--tag {
    font-size: 12px;
    color: #f44;
  }

  &--text {
    font-size: 16px;
    color: #f44;
    padding-left: 3px;
  }
}

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
