<template>
  <div class="goods-item">
    <div
      class="goods-item__thumb"
      @click.stop="onClickThumb"
    >
      <img-wrap
        :width="'110px'"
        :height="'62px'"
        :src="goods.thumbUrl"
        :fullfill="'!240x240+2x.jpg'"
        :cover="false"
      />
      <van-tag v-if="tagName" class="goods-item__thumb-tag">
        {{ tagName }}
      </van-tag>
    </div>

    <div class="goods-item__content">
      <p class="goods-item__title">
        {{ goods.title }}
      </p>
      <p
        v-if="goods.desc && goods.hasMultiSkus && goods.totalStock > 0"
        class="goods-item__desc"
        @click.stop="showSku"
      >
        <span class="goods-item__desc-detail">
          <span class="goods-item__desc-detail-name">{{ goods.desc }}</span>
          <vis-icon
            size="14px"
            name="arrow-down"
            color="#c8c9cc"
          />
        </span>
      </p>
      <div class="goods-item__bottom">
        <template v-if="isShowBuyinfo">
          <span
            v-if="isMatchPackage"
            class="goods-item__price theme__color"
            :class="{'price--top': !goods.hasMultiSkus}"
          >
            <!-- ￥{{ goods.activityPrice }} -->
            <vis-price-label :price="goods.activityPrice" font-size="15" :active-color="themeColor" />
          </span>
          <span
            class="goods-item__origin goods-item__origin--del"
          >
            价格￥{{ goods.originPrice }}
          </span>
        </template>
        <span v-else class="goods-item__tip">
          {{ buyTip }}
        </span>
        <span class="goods-item__num">x {{ goods.num }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import { ImgWrap, Icon, PriceLabel } from '@youzan/vis-ui';
import { themeColor } from 'common/constants';
import * as SafeLink from '@youzan/safe-link';

const { _global } = window;
const { url } = _global;

export default {
  name: 'goods-item',

  components: {
    'vis-icon': Icon,
    'van-tag': Tag,
    'img-wrap': ImgWrap,
    'vis-price-label': PriceLabel,
  },

  props: {
    isMatchPackage: Boolean,
    packageIndex: Number,
    goodsIndex: Number,
    // 活动id
    activityId: {
      type: Number,
      default: 0,
    },
    // 商品
    goods: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      url: _global.url,
      themeColor: themeColor[_global.globalTheme],
    };
  },

  computed: {
    tagName() {
      const { owlType, courseTypeName = '', mediaType = 0 } = this.goods;
      if (owlType === 10) {
        return courseTypeName;
      } else if (owlType === 4) {
        return '直播';
      } else if (owlType === 2) {
        if (mediaType === 1) {
          return '图文';
        } else if (mediaType === 2) {
          return '音频';
        } else {
          return '视频';
        }
      } else if (owlType === 1) {
        return '专栏';
      }
      return '';
    },

    isShowBuyinfo() {
      const { isPaid, totalStock, owlType } = this.goods;
      if (owlType === 10) {
        return totalStock > 0;
      } else {
        return !isPaid;
      }
    },

    buyTip() {
      const { isPaid, totalStock, owlType } = this.goods;
      if (owlType === 10 && totalStock === 0) {
        return '已售罄';
      }
      if (owlType !== 10 && isPaid) {
        return '已拥有，不可重复购买';
      }
      return '';
    },
  },

  methods: {
    showSku() {
      this.$store.dispatch('FETCH_GOODS_SKU', {
        activityId: this.activityId,
        productAlias: this.goods.alias,
        packageIndex: this.packageIndex,
        goodsIndex: this.goodsIndex,
      });
    },

    onClickThumb() {
      const { owlType, alias } = this.goods;
      let redirectUrl = '';
      if (owlType === 10) {
        redirectUrl = `/wscvis/edu/prod-detail?alias=${alias}`;
      } else if (owlType === 1) {
        redirectUrl = `/wscvis/knowledge/index?page=columnshow&alias=${alias}`;
      } else if (owlType === 2) {
        redirectUrl = `/wscvis/knowledge/index?page=contentshow&alias=${alias}`;
      } else {
        redirectUrl = `/wscvis/knowledge/index?page=livedetail&alias=${alias}`;
      }
      SafeLink.redirect({
        url: `${url.h5}${redirectUrl}&kdt_id=${_global.kdt_id}`,
        kdtId: window._global.kdt_id,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import 'mixins/index.scss';

.goods-item {
  display: flex;
  position: relative;
  padding: 2px 0;
  border-radius: 4px;
  background-color: #fff;
  text-align: left;
  color: #323233;
  font-size: 12px;
  box-sizing: border-box;

  &__thumb {
    position: relative;
    margin-right: 10px;
    width: 110px;
    height: 62px;

    &-tag {
      position: absolute;
      right: 4px;
      bottom: 4px;
      font-size: 12px;
      line-height: 12px;
      padding: 4px;
      border-radius: 10px;
      background-color: rgba(60, 60, 60, .8) !important;
    }

    .imgWrap {
      border-radius: 4px;
    }
  }

  &__content {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    position: relative;
  }

  &__title {
    line-height: 16px;
    font-size: 12px;

    @include multi-ellipsis(2);
  }

  &__desc {
    margin-top: 8px;
    max-width: 100%;
    line-height: 16px;

    &-detail {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      color: #969799;
      font-size: 12px;
      background-color: #f7f8fa;

      &-name {
        flex: 1;
      }

      .vis-icon {
        margin-left: 8px;
      }
    }
  }

  &__bottom {
    width: 100%;
    line-height: 1;
    margin-top: 16px;

    .vis-price-label__box {
      margin: 0;
      margin-bottom: 4px;
      padding: 0;
    }
  }

  /* &__price {
    margin-right: 12px;
    color: #f03535;
  } */

  &__origin {
    color: #666;
  }

  &__origin--del {
    text-decoration: line-through;
    color: #969799;
  }

  &__tip {
    font-size: 12px;
    color: #969799;
  }

  &__num {
    float: right;
    color: #969799;
  }
}

.sku-arrow {
  position: relative;
  top: 4px;
}
</style>
