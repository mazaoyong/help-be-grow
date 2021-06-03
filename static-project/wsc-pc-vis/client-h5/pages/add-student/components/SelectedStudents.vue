<template>
  <div class="selected-students">
    <div
      v-for="stu in selected"
      :key="stu.assetNo"
      class="selected-students__item"
      @click="onDelete(stu)"
    >
      {{ stu.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'selected-students',

  components: {
  },

  props: {
    selected: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onDelete(stu) {
      this.$emit('unselect', stu);
    },
  },
};
</script>

<style lang="postcss">
.selected-students {
  margin-top: 10px;
  padding: 16px 15px 16px 0;
  white-space: nowrap;
  overflow: auto;
  background: #fff;
  border-radius: 4px;

  &__item {
    display: inline-block;
    position: relative;
    margin-left: 15px;
    line-height: 32px;
    padding: 0 16px;
    font-size: 13px;
    color: #323233;
    background: #f7f8fa;
    border-radius: 16px;

    &-close {
      position: absolute;
      top: -4px;
      right: -4px;
    }
  }
}
</style>
