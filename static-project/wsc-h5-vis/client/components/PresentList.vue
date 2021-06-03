<template>
  <div class="present-list">
    <div
      v-for="(good, index) in presentGoodList"
      :key="index"
      class="present-list__item"
      :style="{ backgroundColor: bgColor }"
      @click="onClickItem(good)"
    >
      <img-wrap
        class="present-list__item-img"
        :width="'110px'"
        :height="'62px'"
        :src="good.imageUrl"
        :fullfill="'!220x220.jpg'"
        :cover="false"
      />
      <div :class="['present-list__item-detail', isShowNum ? 'show-margin' : '']">
        <p class="title">
          {{ good.title }}
        </p>
        <div :class="isShowNum ? '' : 'show-flex'">
          <p
            v-if="good.presentSkuDesc"
            class="sku"
          >
            {{ good.presentSkuDesc }}
          </p>
          <vis-price-current
            :price="good.presentPrice"
            :mini-decimals="false"
            :active-color="themeColor"
            font-size="14"
            class="present-item__detail-price"
          />
        </div>
      </div>
      <div
        v-if="isShowNum"
        class="present-list__item-num"
      >
        x{{ good.num }}
      </div>
    </div>
  </div>
</template>

<script>
import * as SafeLink from '@youzan/safe-link';
import { ImgWrap, PriceLabel } from '@youzan/vis-ui';
import { themeTypeMap, themeColor } from 'common/constants';

const { CurrentPrice } = PriceLabel;
const themeType = window._global.themeType;
const kdtId = window._global.kdtId || window._global.kdt_id;

export default {
  name: 'present-list',

  components: {
    ImgWrap,
    'vis-price-current': CurrentPrice,
  },

  props: {
    presentGoodList: {
      type: Array,
      default: () => {
        return [];
      },
    },

    bgColor: {
      type: String,
      default: '#fff',
    },

    isCanRedirect: {
      type: Boolean,
      default: false,
    },

    isShowNum: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      themeColor: themeColor[themeTypeMap[themeType]],
    };
  },

  methods: {
    onClickItem(item) {
      if (this.isCanRedirect) {
        SafeLink.redirect({
          url: item.url,
          kdtId,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.present-list {
  padding: 12px;

  &__item {
    position: relative;
    display: flex;
    height: 62px;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 4px;

    &-img {
      min-width: 110px;
      border-radius: 2px;
      margin-right: 8px;
    }

    &-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      overflow: hidden;

      &.show-margin {
        margin-right: 15px;
      }

      .title {
        line-height: 18px;
        font-size: 12px;
        color: #323233;

        @include multi-ellipsis(1);
      }

      .sku {
        line-height: 16px;
        font-size: 11px;
        color: #969799;
      }

      .show-flex {
        display: flex;
        width: 100%;
        flex-direction: row-reverse;
        align-items: baseline;

        .sku {
          flex: 1;
          text-align: right;
          color: #323233;
        }

        .present-item__detail-price {
          flex: 1;
          text-align: left;
        }
      }

    }

    &-num {
      position: absolute;
      right: 12px;
      align-self: center;
      font-size: 11px;
      color: #969799;
    }
  }
}
</style>
