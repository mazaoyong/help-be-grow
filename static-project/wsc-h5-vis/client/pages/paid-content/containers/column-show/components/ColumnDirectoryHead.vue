<template>
  <div class="column-directory">
    <div class="column-directory__title">
      {{ sortTitle }}
      ({{ itemTotal }})
    </div>
    <div class="column-directory__sort" @click="onSetSort">
      <svg-icon
        v-if="sortType === 'desc'"
        class="column-directory__sort-icon"
        symbol="sort_reverse"
      />
      <svg-icon
        v-else
        class="column-directory__sort-icon"
        symbol="sort"
      />
      <div class="column-directory__sort-text">
        {{ sortType === 'desc' ? '倒序' : '正序' }}
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from 'components/svg-icon';

export default {
  name: 'column-directory-head',

  components: {
    SvgIcon,
  },

  props: {
    itemTotal: [Number, String],
    sortType: {
      type: String,
      default: 'desc',
    },
    sortTitle: {
      type: String,
      default: '全部内容',
    },
  },

  computed: {
    isDesc() {
      if (this.sortType === 'desc') return true;
      return false;
    },
  },

  methods: {
    onSetSort() {
      this.isDesc ? this.$emit('changeSort', { type: 'asc' }) : this.$emit('changeSort', { type: 'desc' });
    },
  },
};
</script>

<style lang="scss">
.column-directory {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;

  &__title {
    font-size: 14px;
    color: #323233;
    background-color: #f8f8f8;
    font-weight: bold;

    &-num {
      font-size: 12px;
      color: #666;
      font-weight: normal;
    }
  }

  &__sort {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: flex-end;

    &-icon {
      width: 14px;
      height: 11px;
      margin-right: 3px;
      display: inline-block;
    }

    &-text {
      display: inline-block;
      line-height: 10px;
    }
  }
}
</style>
