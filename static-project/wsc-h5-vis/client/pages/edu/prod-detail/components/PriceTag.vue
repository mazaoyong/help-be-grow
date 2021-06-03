<template>
  <div v-if="isShow" class="price-tag-container">
    <div class="price-tag-container__current">
      <div>
        <vis-price-current
          :price="currentPrice"
          :bold="false"
          class="price-current"
          no-split
          :turn-free="currentPrice.length > 1 ? false : true"
        />
        <van-tag
          v-if="tagName"
          class="price-tag-container__tag activity-tag theme-tag"
          round
        >
          {{ tagName }}
        </van-tag>
      </div>
      <slot />
      <span
        v-if="isOriginString()"
        class="price-tag-container__del"
      >
        <span class="price-tag-container__del-unit">
          ¥
        </span>
        <span class="price-tag-container__del-price">
          {{ originPrice }}
        </span>
      </span>
      <span v-else-if="originPrice" class="price-tag-container__del">
        <span>
          原价
        </span>
        <vis-price-old
          :class="isShowGroupon ? 'price-tag-container__wrap' : ''"
          :price="originPrice"
          no-split
        />
      </span>
    </div>
    <div
      v-if="isShowGroupon"
      class="price-tag-container__countdown"
    >
      <span>距离结束:</span>
      <count-down :end-at="endAt" />
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import { PriceLabel } from '@youzan/vis-ui';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import CountDown from '../../components/CountDown';

export default {
  name: 'price-tag',

  components: {
    [Tag.name]: Tag,
    'vis-price-current': PriceLabel.CurrentPrice,
    'vis-price-old': PriceLabel.OldPrice,
    [CountDown.name]: CountDown,
  },

  props: {
    tagName: {
      type: String,
      default: '',
    },
    currentPrice: {
      type: Array,
      default: () => {
        return [];
      },
    },
    originPrice: {
      type: [Array, String],
      default: null,
    },
    isShowGroupon: {
      type: Boolean,
      default: false,
    },
    endAt: {
      type: [Number, String],
      default: 0,
    },
  },

  computed: {
    // 0元的时候不显示
    isShow() {
      const [min, max] = this.currentPrice;
      return max ? +max !== 0 : +min !== 0;
    },
  },

  methods: {
    isOriginString() {
      return !isEmpty(this.originPrice) && isString(this.originPrice);
    },
  },
};
</script>

<style lang="scss">
  .price-tag-container {
    position: relative;
    left: -1px;
    margin-bottom: 12px;

    &__current {
      display: inline-block;
    }

    .vis-price-label__item {
      line-height: 1;
      vertical-align: baseline;
    }

    &__tag {
      margin-left: 5px;
      line-height: 14px;
      font-size: 12px;
      transform: scale(0.84);
    }

    &__wrap {
      display: block !important;
      padding-top: 10px;
    }

    &__countdown {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 12px;
      color: #666;
    }

    &__del {
      margin-left: 3px;
      font-size: 12px;
      color: #969799;
      line-height: 16px;

      &-unit,
      &-price {
        text-decoration: line-through;
      }
    }

    .price-current {
      .vis-price-content {
        font-weight: bold;
      }
    }

    .vis-price-label__item__disable {
      font-size: 12px;
      color: #969799;
    }
  }
</style>
