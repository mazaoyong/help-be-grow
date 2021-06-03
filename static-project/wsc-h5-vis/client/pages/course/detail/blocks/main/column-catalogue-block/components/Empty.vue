<template>
  <div class="no-data-wrap">
    <no-data class="no-data-icon" :width="size" :height="size" />
    {{ message }}
  </div>
</template>
<script>
import NoData from '@/pages/course/detail/components/no-data';

export default {
  name: 'empty',
  components: {
    NoData,
  },
  props: {
    message: {
      type: String,
      default: '暂无内容',
    },
    size: {
      type: Number,
      default: 100,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
.no-data-wrap {
  padding: 88px 0;
  font-size: 12px;
  color: $disabled-color;
  text-align: center;

  .no-data-icon {
    display: block;
    margin: 0 auto 20px;
  }
}
</style>
