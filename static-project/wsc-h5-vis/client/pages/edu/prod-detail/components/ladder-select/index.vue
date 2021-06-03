<template>
  <van-sku
    :value="value"
    :sku="sku"
    close-on-click-overlay
    safe-area-inset-bottom
    v-on="proxyListeners"
    @sku-selected="handleSkuSelected"
  >
    <!-- 通过slot主动置空的形式，覆盖原来的DOM -->
    <template slot="sku-stepper">
      <div />
    </template>
    <template slot="sku-messages">
      <div />
    </template>
    <template slot="sku-header">
      <div class="header">
        <img-wrap
          class="picture"
          :src="cover"
          :cover="false"
          fullfill="!100x0.jpg"
          width="114px"
          height="64px"
        />
        <p v-theme:color.main class="header-price">
          <span class="price-label">￥</span>
          {{ price }}
          <span v-theme.main10="'background'" class="ladder-price-tag">拼团价</span>
        </p>
      </div>
    </template>
    <template slot="sku-actions">
      <div class="van-sku-actions">
        <van-button class="van-button--primary select-action" type="primary" @click="submit">
          下一步
        </van-button>
      </div>
    </template>
  </van-sku>
</template>

<script>
import { Sku, Button, Toast } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';

export default {
  components: {
    'van-sku': Sku,
    'van-button': Button,
    ImgWrap,
  },

  props: {
    cover: {
      type: String,
      default: '',
    },
    ladderPrice: {
      type: Object,
      default: () => ({}),
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: 0,
    },
    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      scale: null,
    };
  },

  computed: {
    sku() {
      return {
        tree: [{
          k: '拼团类型',
          v: Object.keys(this.ladderPrice).map(ladder => ({
            id: ladder,
            name: `￥${format(this.ladderPrice[ladder][0].skuPrice)}/${ladder}人团`,
          })),
          k_s: 's1',
        }],
        list: Object.keys(this.ladderPrice).map((ladder, index) => ({
          id: this.ladderPrice[ladder][0].skuId,
          s1: ladder,
          ladder,
          price: this.ladderPrice[ladder][0].skuPrice,
          stock_num: 1,
        })),
        stock_num: 1,
      };
    },

    price() {
      if (this.scale) {
        return `${format(this.ladderPrice[this.scale][0].skuPrice)}`;
      }
      if (this.minPrice === this.maxPrice) {
        return `${format(this.minPrice)}`;
      }
      return `${format(this.minPrice)} - ${format(this.maxPrice)}`;
    },
  },

  methods: {
    handleSkuSelected({ selectedSkuComb }) {
      this.scale = selectedSkuComb && +selectedSkuComb.ladder;
    },

    submit() {
      if (this.scale) {
        this.$emit('resolve', this.scale);
        return;
      }
      Toast('请选择拼团类型');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;

  &::after {
    @include border-retina(bottom);
  }

  .picture {
    border-radius: 4px;
    flex-shrink: 0;
  }

  .header-price {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 500;

    .price-label {
      font-size: 12px;
    }

    .ladder-price-tag {
      padding: 0 4px;
      font-size: 10px;
      font-weight: normal;
      line-height: 16px;
      border-radius: 8px;
    }
  }
}

.select-action {
  width: 100%;
}
</style>
