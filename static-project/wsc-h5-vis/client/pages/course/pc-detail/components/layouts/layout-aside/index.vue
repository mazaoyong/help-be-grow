<template>
  <aside class="layout-aside">
    <van-sticky :offset-top="86">
      <slot />
    </van-sticky>
  </aside>
</template>

<script>
import { Sticky as VanSticky } from 'vant';

export default {
  name: 'layout-aside',

  components: {
    VanSticky,
  },
};
</script>

<style lang="scss">
.layout-aside {
  margin-left: 16px;
  flex: 0 0 322px;

  .van-sticky--fixed {
    right: initial;
    left: initial;
    width: 322px;
  }
}
</style>
