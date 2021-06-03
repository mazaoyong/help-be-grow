<template>
  <van-cell-group :border="false">
    <slot />
  </van-cell-group>
</template>

<script>
import { CellGroup } from 'vant';

export default {
  components: {
    'van-cell-group': CellGroup,
  },
};
</script>

<style lang="scss" scoped>
</style>
