<template>
  <div class="layout-detail">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'layout-detail',
};
</script>

<style lang="scss" scoped>
.layout-detail {
  flex: 1 1 auto;
}
</style>
