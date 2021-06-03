<template>
  <div class="pricetag">
    <span
      v-if="currentPrice || currentPrice === 0"
      class="pricetag__price-icon">
      ￥
    </span>
    <span
      v-if="currentPrice || currentPrice === 0"
      class="pricetag__current">
      {{ currentPrice / 100 | numberToCurrency('') }}
    </span>
    <span
      v-if="originPrice || originPrice === 0"
      class="pricetag__origin">
      {{ originPrice / 100 | numberToCurrency }}
    </span>
    <span
      v-if="tag"
      class="pricetag__tag">
      {{ tag }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'price-tag',

  props: {
    originPrice: [Number, String],
    currentPrice: [Number, String],
    tag: String,
  },
};
</script>

<style lang="scss">
  .pricetag {

    &__price-icon {
      font-size: 12px;
      color: #f44;
    }

    &__current {
      font-size: 24px;
      color: #f44;
    }

    &__origin {
      font-size: 12px;
      color: #666;
      opacity: .6;
      text-decoration: line-through;
      margin-right: 5px;
    }

    &__tag {
      color: #f44;
      font-size: 10px;
      border: 1px #f44 solid;
      border-radius: 2px;
      vertical-align: text-bottom;
      padding: 2px;
    }

    span {
      display: inline-block;
    }
  }
</style>
