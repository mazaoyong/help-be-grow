<template>
  <div class="block-a">
    <component-a />
    <component-b />
  </div>
</template>

<script>
import ComponentA from '../../components/component-a';
import ComponentB from '../components/component-b';

export default {
  name: 'block-a',

  components: {
    ComponentA,
    ComponentB,
  },
};
</script>

<style lang="scss">
.block-a {}
</style>
