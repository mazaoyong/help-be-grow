<template>
  <div class="package-buy__detail">
    <goods-card
      v-for="item in formatedGoodsList"
      :key="item.id"
      class="detail__item"
      v-bind="item"
    >
      <div v-if="item.sku" class="detail__sku">
        {{ item.sku }}
      </div>
      <div class="detail__footer">
        <cap-price
          v-if="isMatchPackageBuy"
          v-theme.main
          :price="item.price"
          :origin-price="item.originPrice"
        />
        <div v-else class="detail__origin-price">
          <span>价格:</span>
          <span>{{
            item.originPrice | formatMoney
          }}</span>
        </div>

        <span>x{{ item.num }}</span>
      </div>
    </goods-card>
  </div>
</template>

<script>
import { get, find } from 'lodash';
import { OWL_TYPE } from '@/constants/course/owl-type';

import { Price } from '@youzan/captain';
import GoodsCard from '@/components/goods-card';

export default {
  name: 'package-buy-list',

  components: {
    GoodsCard,
    'cap-price': Price,
  },

  props: {
    goodsList: {
      type: Array,
      default: () => [],
    },

    extra: {
      type: Object,
      default: () => ({}),
    },

    isMatchPackageBuy: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    formatedGoodsList() {
      return this.goodsList.map(item => {
        const { alias } = item;
        const extraData = this.extra[alias] || {};

        return {
          title: item.title,
          img: item.imgUrl,
          imgTag: this.getImgTag(item),
          sku: this.getSkuDesc(item.sku),
          owlType: item.owlType,
          mediaType: extraData.mediaType,
          price: this.getPrice(item),
          originPrice: item.price,
          num: item.num,
        };
      });
    },
  },

  methods: {
    getSkuDesc(sku) {
      try {
        sku = JSON.parse(sku);
        return sku.map(({ v }) => v).join('；');
      } catch (error) {
        return '';
      }
    },

    getImgTag(goods) {
      if (goods.owlType === OWL_TYPE.COURSE) {
        return get(goods, 'orderCourseDTO.courseTypeName', '');
      }
      return '';
    },

    getPrice(goods) {
      const { alias } = goods;
      const extraData = this.extra[alias] || {};
      const sku =
        find(extraData.packageBuySkus, ({ id }) => goods.skuId === id) || {};
      return sku.collocationPrice;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.package-buy__detail {
  .detail__item {
    .title {
      font-weight: 500 !important;
    }

    .bottom {
      margin-top: 8px !important;
    }
  }

  .detail__footer {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }

  .detail__origin-price {
    font-size: 12px;
    color: $disabled-color;
    text-decoration: line-through;
  }
}
</style>
