<template>
  <div v-if="buyNotice" class="buy-notice-block">
    <van-divider class="divider">
      购买须知
    </van-divider>
    <p class="notice-content">
      {{ buyNotice }}
    </p>
  </div>
</template>

<script>
import { Divider } from 'vant';

export default {
  components: {
    'van-divider': Divider,
  },

  rootState: ['goodsData'],

  computed: {
    buyNotice() {
      return this.goodsData.buyNotice;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.buy-notice-block {
  padding: 0 16px 16px;
  margin: -8px 0 8px;
  background-color: $white;

  .divider {
    margin: 0;
    font-size: 10px;
    line-height: 40px;
    color: $main-text-color;
  }

  .notice-content {
    white-space: pre-line;
    font-size: 10px;
    line-height: 1.5;
    color: $main-text-color;
  }
}
</style>
