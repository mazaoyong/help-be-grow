<template>
  <div v-if="show" class="goodslist">
    <van-cell
      :border="false"
      title="好物推荐"
    />

    <div class="goodslist__content">
      <div v-for="item in goodsList" :key="item.id">
        <item-real-goods :item="item" class="goodslist__content--fit" />
      </div>
    </div>

    <div
      v-if="showAllBtn"
      class="goodslist__showmore"
      @click="onClickShowAll">
      <span>展开全部</span>
      <van-icon name="arrow-down" />
    </div>
  </div>
</template>

<script>
import { Cell, Icon } from 'vant';
import ItemRealGoods from '../ItemRealGoods';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';

export default {
  name: 'goods-list',

  components: {
    ItemRealGoods,
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

    goodsList() {
      return this.goodsListAdaptor(this.sortedRecommends);
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

    goodsListAdaptor(goodsList) {
      return goodsList.map(item => {
        return {
          id: item.productId,
          title: item.title,
          price: ((item.price || '') / 100).toFixed(2),
          image_url: item.cover || '',
          url: item.url || `https://h5.youzan.com/v2/goods/${item.alias}`,
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

  .goodslist {
    margin-top: 10px;
    background-color: #fff;
    overflow-x: hidden;

    .van-cell__title {
      font-weight: 500;
    }

    .item__footer {
      display: flex;
      justify-content: space-between;
    }
  }

  .goodslist__content {
    padding: 5px 0;

    &--fit {
      padding: 12px 16px;

      .item__thumbnail-container {

        .item__thumbnail {
          object-fit: contain;
        }
      }
    }
  }

  .goodslist__title {
    font-size: 14px;
    font-weight: bold;
    color: $new-main-black;
    padding: 13px 15px;
    position: relative;
    line-height: 20px;
  }

  .goodslist__title::after {
    @include border-retina(bottom);

    left: 15px;
  }

  .goodslist__showmore {
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
