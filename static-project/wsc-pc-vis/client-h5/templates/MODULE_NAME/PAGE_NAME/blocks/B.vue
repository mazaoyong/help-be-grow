<template>
  <div class="block-b">
    <component-a />
    <component-b />
  </div>
</template>

<script>
import ComponentA from '../../components/component-a';
import ComponentB from '../components/component-b';

export default {
  name: 'block-b',

  components: {
    ComponentA,
    ComponentB,
  },
};
</script>

<style lang="scss">
.block-b {}
</style>
