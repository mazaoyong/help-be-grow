<template>
  <div class="sku-header">
    <img-wrap
      class="picture"
      :src="picture"
      :cover="false"
      fullfill="!100x0.jpg"
      width="114px"
      height="64px"
    />
    <div class="content">
      <div>
        <current-price
          class="current-price"
          :price="priceAndStock.currentPrice"
          :active-color="mainColor"
          :turn-free="true"
          :mini-symbol="false"
          :mini-decimals="false"
          bold
          no-split
        />
        <mini-font-tag
          v-if="priceTag"
          class="mini-price-tag"
          height="16px"
          :text="priceTag"
          :background-color="tagBg"
          :color="mainColor"
        />
      </div>
      <div v-if="priceAndStock.oldPrice">
        <span class="old-prev">价格</span>
        <old-price class="old-price" :price="priceAndStock.oldPrice" disable-color="#c8c9cc" />
      </div>
      <p v-if="!formatSku.hideStock" class="left-stock">
        剩余{{ priceAndStock.stockNum }}个名额
      </p>
    </div>
  </div>
</template>

<script>
import { get, each } from 'lodash';
import { ImgWrap, PriceLabel } from '@youzan/vis-ui';
import { fns } from '@youzan/vue-theme-plugin';
import MiniFontTag from '@/components/mini-font-tag';
import { mapState } from 'vuex';

const { CurrentPrice, OldPrice } = PriceLabel;

export default {
  components: {
    ImgWrap,
    CurrentPrice,
    OldPrice,
    MiniFontTag,
  },

  computed: {
    ...mapState(['activitySku', 'picture', 'selectedSku', 'originSku', 'formatSku', 'priceTag']),

    priceAndStock() {
      const skuList = get(this.formatSku, 'list', []);
      const stockNum = get(this.formatSku, 'stockNum', 0);
      const { minPrice, maxPrice } = this.formatSku;
      let priceInfo = {};
      if (this.selectedSku) {
        const { id, price, stockNum, activityPrice } = this.selectedSku;
        each(skuList, (item) => {
          if (item.id === id) {
            priceInfo = {
              currentPrice: activityPrice,
              oldPrice: price,
              stockNum: stockNum,
            };
          }
        });
      } else {
        let oldPrice = [minPrice, maxPrice];
        let currentPriceList = [];
        each(skuList, (item) => {
          currentPriceList.push(item.activity_price);
        });
        priceInfo = {
          currentPrice: [Math.min(...currentPriceList), Math.max(...currentPriceList)],
          oldPrice,
          stockNum,
        };
      }

      return priceInfo;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    tagBg() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.sku-header {
  @include clearfix;

  position: relative;
  padding: 12px 0 12px 122px;
  margin: 0 16px;

  .picture {
    float: left;
    margin-left: -122px;
    border-radius: 4px;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 64px;
    padding-right: 20px;

    .points-price {
      margin-bottom: 8px;
      font-size: 16px;
    }

    .current-price {
      font-size: 16px;

      ::v-deep .vis-price-label__item {
        line-height: 20px;
      }

      ::v-deep .vis-price-symbol {
        font-size: 16px;
      }
    }

    .mini-price-tag {
      padding: 0 2px;
      margin-left: 4px;
      vertical-align: text-top;
    }

    .old-prev {
      font-size: 12px;
      color: $gray-icon-color;
    }

    .old-price {
      display: inline;
      font-size: 12px;
      color: $gray-icon-color;
    }

    .left-stock {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: $disabled-color;
    }
  }

  // after 被 clearfix 用了
  &::before {
    @include border-retina(bottom, $light-border-color);
  }
}
</style>
