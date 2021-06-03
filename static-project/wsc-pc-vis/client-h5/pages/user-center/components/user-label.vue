<template>
  <a href="javascript: void(0);" class="label">
    <slot />
  </a>
</template>

<script>
export default {
  name: 'user-label',
};
</script>

<style lang="scss" scoped>
.label {
  display: block;
  margin: 10px 0;
  padding: 0 25px 0 15px;
  height: 62px;
  line-height: 62px;
  border-radius: 4px;
  background-color: #fff;
}
</style>
