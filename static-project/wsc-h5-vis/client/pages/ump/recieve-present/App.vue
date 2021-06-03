<template>
  <div id="app-content">
    <router-view />
  </div>
</template>

<script>

export default {
  mounted() {
    this.$store.dispatch('listPresentsByCondition');
  },
};
</script>
