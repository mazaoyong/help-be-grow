<template>
  <div class="discount-total">
    <span>合计：{{ total | formatTotalInfo }}</span>
  </div>
</template>

<script>
export default {
  name: 'discount-total',

  filters: {
    formatTotalInfo(value) {
      if (typeof value === 'number') {
        return `-￥${value / 100}`;
      }
      return value;
    },
  },

  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

  .discount-total {
    position: relative;
    margin: 0 16px;
    padding: 20px 0;
    text-align: right;
    font-size: 12px;
    color: #323233;
    line-height: 16px;

    &::before {
      @include border-retina(top, #ebedf0);
    }
  }
</style>
