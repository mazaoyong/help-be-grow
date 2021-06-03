<template>
  <div class="dynamic-item-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'dynamic-item-container',
};
</script>

<style lang="scss" scoped>
.dynamic-item-container {
  position: relative;
  padding-left: 16px;
  border-left: 1px dashed #ddd;
  &::before {
    display: block;
    position: absolute;
    top: 5px;
    left: -4px;
    width: 6px;
    height: 6px;
    content: '';
    border: 1px solid #00b389;
    border-radius: 4px;
    background-color: #fff;
  }
}
</style>
