<template>
  <div class="card">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'card',
};
</script>

<style lang="scss" scoped>
.card {
  margin: 10px;
  border-radius: 4px;
  background-color: #fff;
}
</style>
