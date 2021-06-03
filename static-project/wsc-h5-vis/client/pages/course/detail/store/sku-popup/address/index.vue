<template>
  <van-cell
    v-if="choose.skuContent || choose.skuRightContent"
    class="address-cell"
    title-class="address-title"
    value-class="address-value"
    :title="choose.skuContent"
    :value="choose.skuRightContent"
    is-link
    :border="false"
    @click="click"
  />
</template>

<script>
import { Cell } from 'vant';
import store from '../../index';

export default {
  components: {
    'van-cell': Cell,
  },

  computed: {
    choose() {
      return store.getters.choose;
    },
  },

  methods: {
    click() {
      const action = this.choose.skuAction;
      action && store.dispatch(action);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.address-cell {
  padding: 8px 0 10px;
  line-height: 32px;

  ::v-deep .van-icon {
    line-height: 32px;
    color: $gray-icon-color;
  }
}

.address-title {
  color: $main-text-color;
}

.address-value {
  font-size: 12px;
  color: $vice-text-color;
}
</style>
