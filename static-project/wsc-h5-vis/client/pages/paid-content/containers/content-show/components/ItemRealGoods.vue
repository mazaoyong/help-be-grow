<template>
  <list-item
    :url="item.url"
    :thumbnail-url="item.image_url"
    :thumbnail-width="98"
    :thumbnail-height="98"
    :need-log="true"
    :log-id="item.goodsId || item.id"
    :title="item.title"
  >
    <recommend-item-price slot="footer-left" :price="item.price" />
  </list-item>
</template>

<script>
import ListItem from 'components/list-item';
import RecommendItemPrice from './goods-recommends/RecommendItemPrice';

export default {
  name: 'item-real-goods',

  components: {
    ListItem,
    RecommendItemPrice,
  },

  props: {
    item: Object,
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
  }
}

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
