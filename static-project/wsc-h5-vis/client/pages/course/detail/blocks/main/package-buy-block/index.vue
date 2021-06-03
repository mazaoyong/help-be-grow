<template>
  <info-block
    v-if="show"
    v-tab="tab"
    v-log="['package_all', '点击优惠套餐查看全部']"
    class="package-buy-block"
    :title="title"
    :has-more="hasMore"
    :url="url"
  >
    <div class="content">
      <div class="goods-list">
        <a
          v-for="goods in goodsList"
          :key="goods.id"
          class="goods-item"
          :href="getGoodsUrl(goods.alias)"
        >
          <img-wrap
            width="78px"
            height="45px"
            fullfill="!small.jpg"
            :src="goods.thumbUrl"
            :cover="false"
          />
          <p class="title">
            {{ goods.title }}
          </p>
          <p v-if="isMixed" v-theme:color.main class="price">
            {{ getPriceStr(goods.decrease) }}
          </p>
        </a>
      </div>
      <div class="info">
        <p class="total-price">
          <span>{{ pricePrefix }}</span>
          <span v-theme:color.main>{{ price }}</span>
          <span>{{ priceSuffix }}</span>
        </p>
        <p class="tip">
          {{ tip }}
        </p>
        <a
          v-theme:color.main
          v-theme:borderColor.main
          v-log="['package_buy', '点击优惠套餐去购买']"
          class="button"
          :href="url"
        >去购买</a>
      </div>
    </div>
  </info-block>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { PACKAGE_BUY_TYPE } from '@/constants/ump/package-buy-type';
import InfoBlock from '@/pages/course/detail/components/info-block';

export default {
  components: {
    ImgWrap,
    InfoBlock,
  },

  rootState: ['goodsData', 'activityTypes', 'activityData', 'env', 'kdtId'],
  rootGetters: ['isColumn', 'isOnlineCourse'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      return this.activityTypes.includes(ACTIVITY_TYPE.PACKAGE_BUY);
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    isMixed() {
      return this.activityData.packageType === PACKAGE_BUY_TYPE.MIXED;
    },

    title() {
      if (this.isMixed) {
        return '搭配购买更划算';
      }
      if (this.activityData.totalNum > 1) {
        return `购买套餐更划算（${this.activityData.totalNum}）`;
      }
      return '购买套餐更划算';
    },

    hasMore() {
      return !this.isMixed && this.activityData.totalNum > 1;
    },

    url() {
      return `/wscvis/ump/package-buy?productAlias=${this.goodsData.alias}&kdt_id=${this.kdtId}`;
    },

    goodsList() {
      return this.activityData.goodsList.slice(0, 3);
    },

    pricePrefix() {
      return this.isMixed ? '最多省' : '立省';
    },

    price() {
      return this.getPrice(this.activityData.decrease);
    },

    priceSuffix() {
      if (this.activityData.decrease < 1000000) {
        return '元';
      }
      return '万';
    },

    tip() {
      return this.isMixed ? '搭配购买' : `共${this.activityData.goodsList.length}门课程`;
    },
  },

  methods: {
    getGoodsUrl(alias) {
      // 优惠套餐这里暂时不跳转，后面可加
      return 'javascript:;';
    },

    getPrice(price) {
      if (price < 1000000) {
        return +format(price, true, false);
      }
      return +format(price / 10000, true, false);
    },

    getPriceStr(price) {
      if (price) {
        if (price < 1000000) {
          return `省${this.getPrice(price)}元`;
        }
        return `省${this.getPrice(price)}万元`;
      }
      return '省 - 元';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.package-buy-block {
  margin-bottom: 8px;

  .content {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;

    .goods-list {
      @include clearfix;

      max-height: 81px;
      overflow: hidden;

      .goods-item {
        float: left;
        margin-right: 4px;
        line-height: 16px;

        .title {
          @include ellipsis;

          width: 78px;
          margin-top: 4px;
          font-size: 10px;
          color: $main-text-color;
        }

        .price {
          font-size: 10px;
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      .total-price {
        font-size: 14px;
        line-height: 18px;
        color: $main-text-color;
        white-space: nowrap;
      }

      .tip {
        font-size: 10px;
        line-height: 14px;
        color: $gray-icon-color;
      }

      .button {
        display: block;
        width: 52px;
        margin-top: 8px;
        font-size: 12px;
        line-height: 22px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;
      }
    }
  }
}
</style>
