<template>
  <div class="free-list">
    <!-- <div class="free-list__title">
      免费内容 <span>({{ itemTotal }})</span>
    </div>
    <div class="free-list__line" /> -->
    <column-directory-head
      v-if="contentList.length"
      :item-total="itemTotal"
      :sort-type="freeSort"
      :sort-title="'免费内容'"
      @changeSort="onChangeType"
    />
    <item-free-content
      v-for="item in contentList"
      :key="item.alias"
      :item="item"
    />
  </div>
</template>

<script>
import ItemFreeContent from './ItemFreeContent';
import ColumnDirectoryHead from './ColumnDirectoryHead';

export default {
  name: 'column-free-list',

  components: {
    ItemFreeContent,
    ColumnDirectoryHead,
  },

  props: {
    itemTotal: [Number, String],
    contentList: Array,
    freeSort: {
      type: String,
      default: 'desc',
    },
  },

  methods: {
    onChangeType(ev) {
      ev.type === 'desc' ? this.$emit('freeSort', { type: 'desc' }) : this.$emit('freeSort', { type: 'asc' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
@import 'var';

.item-content {
  padding: 10px 16px;

  .item-row {
    align-items: center;

    .item__title {
      white-space: normal;

      @include multi-ellipsis(2);
    }
  }
}

.free-list {
  margin-top: 10px;
  background-color: $c-white;

  &__title {
    padding: 15px;
    font-size: 14px;
    font-weight: bold;
    color: #333;

    span {
      font-size: 12px;
      color: #999;
    }
  }

  &__line {
    height: 1px;
    background-color: #dcdee0;
    margin-left: 15px;
    transform: scaleY(.5);
  }
}
</style>
