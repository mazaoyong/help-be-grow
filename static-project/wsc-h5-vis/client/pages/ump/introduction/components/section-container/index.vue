<template>
  <div class="section-container">
    <div class="section-container-title">
      {{ title }}
    </div>
    <div class="section-container-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'section-container',
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.section-container {
  margin: 12px 16px 0;
  background: #fff;
  border-radius: 8px;

  &-title {
    height: 39px;
    line-height: 39px;
    color: #ab4d29;
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    background-image: url('https://img01.yzcdn.cn/public_files/931743e6c5f6e74eefbcc4bc2582dc85.png');
    background-repeat: no-repeat;
    background-size: 50% 100%;
    background-position: 50% -1px, 75% -1px;
  }
}
</style>
