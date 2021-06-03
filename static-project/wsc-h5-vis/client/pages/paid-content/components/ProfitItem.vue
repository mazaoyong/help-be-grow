<template>
  <div class="profit-item">
    <div class="profit-item__left">
      <p class="profit-item__bold">
        推广佣金
      </p>
      <p class="profit-item__normal">
        {{ item.createTime }}
      </p>
    </div>
    <div class="profit-item__right">
      <p class="profit-item__bold">
        +{{ item.amount }}
      </p>
      <p class="profit-item__normal">
        购买人：{{ item.nickName }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'profit-item',

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss">
  @import 'var';

  .profit-item {
    display: flex;
    justify-content: space-between;
    padding: 15px;

    &__left {
      text-align: left;
    }

    &__right {
      text-align: right;
    }

    &__bold {
      line-height: 23px;
      font-size: 16px;
      color: $c-black;
      font-weight: 600;
    }

    &__normal {
      line-height: 19px;
      font-size: 13px;
      color: $c-gray-darker;
    }
  }
</style>
