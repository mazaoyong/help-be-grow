<template>
  <div>
    <item
      v-for="(item, index) in items"
      :key="index"
      :detail="item"
      @click.native="onGoCourse(item)"
    />
  </div>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
import { redirect } from '@/common/utils/custom-safe-link';
import Item from './Item.vue';

export default {
  name: 'recommend-list',

  components: {
    'item': Item,
  },
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  methods: {
    onGoCourse(item) {
      this.$track.collect('uc_recommend_click:clickName', 'zhuan_redirect');
      this.$track.runTask('userActivityPageClick');
      redirect({
        url: `/wscvis/course/detail/${item.goodsAlias}`,
        query: {
          kdt_id: _global.kdt_id,
        },
      });
    },
  },
};
</script>
