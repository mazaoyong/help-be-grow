<template>
  <div class="clue-filter-group">
    <div class="title">{{ title }}</div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="postcss" scoped>
.clue-filter-group {
  margin-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;

  .title {
    font-size: 13px;
    color: #969799;
    line-height: 1;
    padding: 10px 0;
  }
}
</style>
