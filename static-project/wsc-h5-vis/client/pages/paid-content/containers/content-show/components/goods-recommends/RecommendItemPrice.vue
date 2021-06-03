<template>
  <div v-if="price" class="recommend-item__price">
    <span class="recommend-item__price--tag">
      ¥
    </span>
    <span class="recommend-item__price--text">
      {{ price }}
    </span>
  </div>
</template>
<script>

export default {
  name: 'recommend-item-price',

  props: {
    price: String,
  },
};
</script>

<style lang="scss">
@import 'var';

.recommend-item__price {

  &--tag {
    font-size: 12px;
    color: #f44;
  }

  &--text {
    font-size: 16px;
    color: #f44;
    padding-left: 0 !important;
  }
}

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
