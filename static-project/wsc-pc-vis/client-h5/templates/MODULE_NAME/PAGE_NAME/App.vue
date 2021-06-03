<template>
  <div class="page-a">
    <block-a />
    <block-b />
  </div>
</template>

<script>
import BlockA from './blocks/A';
import BlockB from './blocks/B';

export default {
  name: 'page-a',

  components: {
    BlockA,
    BlockB,
  },
};
</script>

<style lang="scss">
.page-a {}
</style>
