<template>
  <div class="package-entry">
    <van-cell
      class="package-entry__caption"
      :title="caption"
      :value="showAll ? '查看全部' : ''"
      :is-link="showAll"
      :border="false"
      @click="onBuyClick"
    />
    <div class="package-entry__main">
      <div
        class="package-entry__goods-list"
        :class="[`${packageType === 1 ? 'package-entry__goods-list--mixed' : ''}`]"
      >
        <div
          v-for="goods in goodsList"
          :key="goods.alias"
          class="package-entry__goods"
        >
          <vis-img-wrap
            class="goods__thumbnail"
            :src="goods.thumbUrl"
            :cover="false"
            width="78px"
            height="45px"
          />
          <div class="goods__title">
            {{ goods.title }}
          </div>
          <div v-if="packageType === 1" class="goods__price text-primary">
            {{ genPriceText(goods.decrease) }}
          </div>
        </div>
      </div>
      <div class="package-entry__info">
        <div class="info__price">
          {{ infoPrice }}<span
            class="info__price-text text-primary">
            {{ discountPriceText }}
          </span>{{ discountPriceUnit }}
        </div>
        <div class="info__text">
          {{ infoText }}
        </div>
        <div class="info__btn-buy theme_plain" @click="onBuyClick">
          去购买
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';

import { PACKAGE_TYPE } from './constants';

export default {
  name: 'package-entry',

  components: {
    'van-cell': Cell,
    'vis-img-wrap': ImgWrap,
  },

  props: {
    packageType: {
      type: Number,
      default: 0,
    },
    packageNum: {
      type: Number,
      default: 1,
    },
    goodsList: {
      type: Array,
      default() {
        return [];
      },
    },
    goodsNum: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    productAlias: {
      type: String,
      default: '',
    },
    // 活动 alias
    alias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      PACKAGE_TYPE,
    };
  },

  computed: {
    caption() {
      return this.packageType === PACKAGE_TYPE.FIXED
        ? (this.packageNum > 1 ? `购买套餐更划算（${this.packageNum}）` : '购买套餐更划算')
        : '搭配购买更划算';
    },
    infoText() {
      return this.packageType === PACKAGE_TYPE.FIXED ? `共${this.goodsNum}门课程` : '搭配购买';
    },
    infoPrice() {
      return this.packageType === PACKAGE_TYPE.FIXED ? `立省` : `最多省`;
    },
    showAll() {
      return this.packageNum > 1 && this.packageType === PACKAGE_TYPE.FIXED;
    },
    discountPriceText() {
      if (this.discountPrice === undefined) return;
      const { discountPrice } = this;
      return `${discountPrice < 1000000 ? discountPrice / 100 : (discountPrice / 1000000).toFixed(2)}`;
    },
    discountPriceUnit() {
      return this.discountPrice <= 1000000 ? '元' : '万';
    },
  },

  methods: {
    genPriceText(price) {
      if (price === undefined) return '省 - 元';
      return `省${price < 1000000 ? price / 100 : (price / 1000000).toFixed(2)}${price < 1000000 ? '' : '万'}元`;
    },

    onBuyClick() {
      const reUrl = `${_global.url.h5}/wscvis/ump/package-buy?productAlias=${this.productAlias}&kdt_id=${_global.kdt_id}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId: _global.kdt_id,
      });
    },
  },
};
</script>

<style lang="scss">
.package-entry {
  background: #fff;

  &__caption {
    padding: 10px 16px;

    .van-cell {
      line-height: 20px;
    }

    .van-cell__title {
      line-height: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #111;
    }

    .van-cell__value {
      line-height: 20px;
      font-size: 13px;
      color: #999;
    }

    .van-icon {
      line-height: 20px;
      font-size: 10px;
    }
  }

  &__main {
    display: flex;
  }

  &__goods-list {
    flex: 1 1 auto;
    height: 65px;
    margin: 12px 0 16px 15px;
    overflow: hidden;

    &--mixed {
      height: 81px;
    }
  }

  &__goods {
    display: inline-block;
    margin-left: 4px;
    width: 78px;
    vertical-align: middle;

    &:first-child {
      margin-left: 0;
    }

    .goods {
      &__thumbnail {
        border-radius: 2px;
      }

      &__title {
        margin-top: 4px;
        line-height: 16px;
        font-size: 10px;
        color: #323233;

        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &__price {
        margin-top: 2px;
        line-height: 14px;
        font-size: 10px;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    padding: 0 12px;
    text-align: center;

    .info {

      &__text {
        line-height: 14px;
        font-size: 10px;
        color: #c8c9cc;
      }

      &__price {
        line-height: 18px;
        font-size: 13px;
        color: #323233;
        font-weight: 600;

        &-text {
          line-height: 18px;
          font-size: 13px;
        }

        .vis-price-label__box {
          display: inline-block;
          margin: 0;
          padding: 0;
        }
      }

      &__btn-buy {
        display: inline-block;
        margin-top: 4px;
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        border-radius: 18px;
      }
    }
  }
}
</style>
