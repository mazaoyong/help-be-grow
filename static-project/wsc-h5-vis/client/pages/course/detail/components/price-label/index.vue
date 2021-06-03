<template>
  <div
    class="price-label"
    :style="boxStyle"
  >
    <div
      v-if="prefix"
      class="text prefix"
      :style="subTextStyle"
    >
      {{ prefix }}
    </div>
    <vis-price-label
      :class="[price, isPriceBold ? 'price-bold': '']"
      :price="price"
      :active-color="fontColor"
      :font-size="priceFontSize"
    />
    <div
      v-if="suffix"
      class="text suffix"
      :style="subTextStyle"
    >
      {{ suffix }}
    </div>
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';

export default {
  components: {
    'vis-price-label': PriceLabel,
  },
  props: {
    ...PriceLabel.props,
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    // fontSize: {
    //   type: [Number, String],
    //   default: 16,
    // },
    fontColor: {
      type: String,
      default: PriceLabel.props.activeColor.default,
    },
    backColor: {
      type: String,
      default: 'transparent',
    },
    textFontSize: {
      type: [Number, String],
      default: 12,
    },
    priceFontSize: {
      type: [Number, String],
      default: PriceLabel.props.fontSize.default,
    },
    isPriceBold: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    groupSize() {
      /**
       * 1. 前缀文案长度 < 5; 如限时券后
       *    1.1: price < 100000 [18,12]
       *    1.2: price < 1000000 []
       * 2. 前缀长度 > 5; 如好友推荐券后
       * */
      return {};
    },
    mainfontSize() {
      return 16;
    },
    subTextStyle() {
      const style = {
        fontSize: `${this.textFontSize}px`,
        color: this.fontColor,
        lineHeight: `${this.priceFontSize}px`,
      };
      if (this.textFontSize === 10) {
        Object.assign(style, {
          fontSize: '12px',
          transform: 'scale(.8333333)',
        });
      }
      return style;
    },
    boxStyle() {
      return {
        backgroundColor: this.backColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
.price-label {
  display: flex;
  align-items: center;

  .price-bold {
    ::v-deep .pl-price-container {
      font-weight: bold;
    }
  }

  ::v-deep .vis-price-label__box .pl-price-container {
    font-family: Avenir;
  }

  .text {
    font-weight: bold;
  }

  .prefix {
    margin-right: 2px;
  }
  .suffix {
    margin-left: 2px;
  }
}
</style>
