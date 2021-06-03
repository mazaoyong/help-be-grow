<template>
  <keep-alive exclude="schedule-list">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
body {
  background-color: #f2f2f2;

  &::after {
    height: 0 !important;
  }
}
</style>
