<template>
  <div class="skeleton-container">
    <skeleton />
  </div>
</template>
<script>
import Vue from 'vue';
import Skeleton from '../Skeleton.vue';
export default Vue.extend({
  name: 'tution',
  components: {
    Skeleton,
  },
});
</script>
<style scoped>
.skeleton-container{
  padding: 0 16px;
}
</style>
