<template>
  <span class="vis-course-tag">
    {{ content }}
  </span>
</template>

<script>
export default {
  name: 'course-tag',

  props: {
    content: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-course-tag {
  box-sizing: border-box;
  display: inline-block;
  margin: 10px 6px 0 0;
  padding: 4px 12px;
  height: 22px;
  line-height: 14px;
  font-size: 10px;
  background: #f7f8fa;
  color: #646566;
  border-radius: 999px;
}
</style>
