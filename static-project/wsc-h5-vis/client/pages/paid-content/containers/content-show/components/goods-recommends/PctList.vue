<template>
  <div v-if="show" class="pctlist">
    <van-cell
      :border="false"
      title="知识推荐"
    />

    <div class="pctlist__ctner">
      <div v-for="item in pctList" :key="item.id">
        <component
          :is="item.component"
          v-if="item.item.cover || item.item.title"
          :item="item.item"
          :is-recommends="true"
        />
      </div>
    </div>

    <div
      v-if="showAllBtn"
      class="pctlist__showmore"
      @click="onClickShowAll">
      <span>展开全部</span>
      <van-icon name="arrow-down" />
    </div>
  </div>
</template>

<script>
import { Cell, Icon } from 'vant';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import ItemContent from '../ItemContent';
import ItemColumn from '../ItemColumn';
import ItemLive from '../ItemLive';

export default {
  name: 'pct-list',

  components: {
    ItemContent,
    ItemColumn,
    ItemLive,
    'van-cell': Cell,
    'van-icon': Icon,
  },

  props: {
    recommends: Array,
  },

  data() {
    return {
      sortedRecommends: [],
      allSortedRecommends: [],
      showAllBtn: false,
    };
  },

  computed: {
    show() {
      return !isEmpty(this.recommends);
    },

    pctList() {
      return this.pctListAdaptor(this.sortedRecommends);
    },
  },

  mounted() {
    this.allSortedRecommends = orderBy(this.recommends, ['serialNo', 'productId'], ['desc', 'desc']);
    this.sortedRecommends = this.allSortedRecommends.slice(0, 3);
    this.showAllBtn = this.allSortedRecommends.length > 3;
  },

  methods: {
    onClickShowAll() {
      this.showAllBtn = false;
      this.sortedRecommends = this.allSortedRecommends;
    },

    pctListAdaptor(pctList) {
      return pctList.map(item => {
        return {
          item: Object.assign({}, item, {
            id: item.productId,
            title: item.title,
            price: item.price,
            cover: item.cover || '',
            url: item.url,
          }),
          subtitle: item.summary || '',
          id: item.productId,
          component: ['', ItemColumn.name, ItemContent.name, '', ItemLive.name][item.owlType || 1],
        };
      });
    },
  },

};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  $new-main-black: #323233;
  $new-main-gray: #969799;

  .pctlist {
    margin-top: 10px;
    background-color: #fff;
    overflow-x: hidden;

    .item__footer {
      display: flex;
      justify-content: space-between;
    }

    .van-cell__title {
      font-weight: 500;
    }
  }

  .pctlist__title {
    font-size: 14px;
    font-weight: bold;
    color: $new-main-black;
    padding: 13px 15px;
    position: relative;
    line-height: 20px;
  }

  .pctlist__title::after {
    @include border-retina(bottom);

    left: 15px;
  }

  .pctlist__ctner {

    .item {
      padding: 12px 16px;
    }
  }

  .pctlist__showmore {
    font-size: 13px;
    color: $new-main-gray;
    text-align: center;
    padding: 15px;
    position: relative;
    display: flex;
    justify-content: center;

    .van-icon {
      margin-left: 2px;
    }
  }
</style>
