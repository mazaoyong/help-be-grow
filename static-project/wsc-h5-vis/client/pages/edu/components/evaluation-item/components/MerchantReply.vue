<template>
  <div class="merchant-reply">
    <div class="merchant-reply__content">
      <p class="merchant-reply__content-title">
        商家回复：
      </p>
      <p class="merchant-reply__content-text">
        {{ value.evaluation }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'merchant-reply',

  props: {
    value: Object,
  },
};
</script>

<style lang="scss">
.merchant-reply {
  position: relative;
  padding: 10px 0 5px;

  &::before {
    width: 0;
    height: 0;
    top: 3px;
    left: 50px;
    content: '';
    position: absolute;
    border-style: solid;
    border-width: 0 14px 14px;
    border-color: transparent transparent #f7f8fa;
  }

  &__content {
    padding: 8px;
    margin-left: 40px;
    border-radius: 4px;
    background-color: #f7f8fa;

    &-title {
      line-height: 16px;
      font-size: 12px;
      font-weight: 500;
      color: #323233;
      margin-bottom: 8px;
    }

    &-text {
      color: #7d7e70;
      font-size: 12px;
      line-height: 18px;
      word-wrap: break-word;
    }
  }
}
</style>
