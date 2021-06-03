<template>
  <div class="filter-option-group">
    <div class="filter-option-group__title">
      {{ groupName }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'filter-option-group',

  props: {
    groupName: {
      type: String,
      default: '',
    },

    groupItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="postcss">
  .filter-option-group {
    margin-bottom: 5px;

    &__title {
      line-height: 18px;
      margin-bottom: 10px;
      font-size: 13px;
      color: #969799;
    }
  }
</style>
