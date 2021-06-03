<template>
  <div class="discount-item">
    <van-tag
      v-theme.main
      v-theme.main10="'background'"
      class="discount-item__tag"
      round
    >
      {{ tagName }}
    </van-tag>
    <span class="discount-item__desc">
      {{ description }}
    </span>
    <span class="discount-item__money">
      {{ discountInfo | formatDiscountInfo }}
    </span>
  </div>
</template>

<script>
import { Tag } from 'vant';

export default {
  name: 'discount-item',

  components: {
    'van-tag': Tag,
  },

  filters: {
    formatDiscountInfo(value) {
      if (typeof value === 'number') {
        return `-￥${value / 100}`;
      }
      return value;
    },
  },

  props: {
    tagName: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    discountInfo: {
      type: [String, Number],
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

  .discount-item {
    @include flex-row(space-between, center);

    font-size: 12px;
    line-height: 16px;
    color: #323233;

    &__tag {
      margin-right: 8px;
      font-size: 10px;
      line-height: 14px;
    }
    &__desc {
      flex: 1;
      margin-right: 38px;
    }
  }
</style>
