<template>
  <div v-if="list.length" class="recommends-goods-block">
    <info-block
      v-for="(block, index) in list"
      :key="block.id"
      :title="block.name"
      class="recommends-item"
    >
      <goods-card
        v-for="item in getShowRecommends(block.recommends, index)"
        :key="item.alias"
        v-log="['click_recomment_goods', '点击好物推荐商品']"
        :size="item.productType ? 'small': 'middle'"
        :url="item.productType ? '' : `/wscgoods/detail/${item.alias}`"
        :alias="item.alias"
        :media-type="item.mediaType"
        :owl-type="item.owlType"
        :img="item.cover"
        :title="item.title"
      >
        <span v-if="item.price" v-theme:color.main class="price">
          <span>￥</span>
          <span class="money">{{ getPrice(item.price) }}</span>
        </span>
      </goods-card>
      <fold-bar
        v-if="fold[index]"
        text="展开全部"
        @click="click(index)"
      />
    </info-block>
  </div>
</template>

<script>
import format from '@youzan/utils/money/format';
import GoodsCard from '@/components/goods-card';
import InfoBlock from '@/pages/course/detail/components/info-block';
import FoldBar from '@/pages/course/detail/components/fold-bar';
import rootStore from '@/pages/course/detail/store';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    InfoBlock,
    GoodsCard,
    FoldBar,
  },

  data() {
    return {
      fold: [],
    };
  },

  state: ['list'],

  watch: {
    list(val) {
      this.fold = val.map(item => Boolean(item.recommends) && item.recommends.length > 3);
    },
  },

  created() {
    this.$dispatch('init');
  },

  methods: {
    getShowRecommends(list, index) {
      return this.fold[index] ? list.slice(0, 3) : list;
    },

    getPrice(price) {
      return format(price, true, false);
    },

    click(index) {
      this.$set(this.fold, index, false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.recommends-goods-block {
  .recommends-item {
    margin-bottom: 8px;
  }

  .price {
    font-size: 14px;
    line-height: 20px;
  }

  .money {
    font-weight: bold;
  }
}
</style>
