<template>
  <span class="clue-order-filter-item" :class="{ checked: value }" @click="changeChecked">{{ text }}</span>
</template>

<script>
export default {
  name: 'filter-item',
  props: ['value', 'text'],
  methods: {
    changeChecked() {
      this.$emit('input', !this.value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.clue-order-filter-item {
  display: inline-block;
  width: 155px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 13px;
  background-color: #f7f8fa;

  &.checked {
    background-color: #00b389;
    color: white;
  }
}
</style>
