<template>
  <card title="课程套餐">
    <card-cell
      class="package-buy__content"
      :value="value"
      :border="true"
      @click="onClickCell"
    >
      <div slot="title" class="package-buy__list">
        <vis-img-wrap
          v-for="item in goodsList.slice(0, 3)"
          :key="item.key"
          class="package-buy__img"
          :src="item.imgUrl"
          width="80px"
          height="46px"
        />
      </div>
    </card-cell>
    <div class="package-buy__footer">
      <span>小计：</span>
      <cap-price v-theme.main :price="pay.realPay" />
    </div>
  </card>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import { Price } from '@youzan/captain';
import { Card, CardCell } from '@/pages/trade/buy/components/card';
import { openPackageBuyDetailPopup } from './components/package-buy-detail';

export default {
  name: 'package-buy-block',

  components: {
    Card,
    CardCell,
    'vis-img-wrap': ImgWrap,
    'cap-price': Price,
  },

  state: ['pay', 'packageBuy', 'goods'],

  getters: ['isMatchPackageBuy', 'goodsList'],

  computed: {
    value() {
      return `共${this.goodsList.length}件`;
    },
  },

  methods: {
    onClickCell() {
      openPackageBuyDetailPopup({
        props: {
          goodsList: this.goodsList,
          extra: this.goods.extra,
          isMatchPackageBuy: this.isMatchPackageBuy,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.package-buy {
  &__content {
    align-items: center;

    .van-cell__title {
      margin-right: 0;
    }

    .vis-biz-card-cell__value {
      font-weight: normal;
    }
  }

  &__list {
    display: flex;
  }

  &__img {
    margin-right: 4px;
    border-radius: 4px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__footer {
    padding: 0 12px;
    line-height: 44px;
    height: 44px;
    text-align: right;
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
