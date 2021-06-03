<template>
  <search
    @doChange="onSearchChange"
    @doCancel="onCancelSearch"
  >
    <search-list
      ref="search-list"
      slot="search-list"
      @changeId="onCourseIdChange"
    />
  </search>
</template>

<script>
import Search from './Search';
import SearchList from './SearchList';

export default {

  components: {
    'search-list': SearchList,
    'search': Search,
  },

  data() {
    return {
    };
  },

  methods: {
    onSearchChange(keyword) {
      console.log('[SearchContainer] --> 输出', keyword);
      this.$nextTick(() => {
        this.$refs['search-list'].fetchList(true);
      });
    },
    onCourseIdChange(item) {
      this.$emit('choose', item);
    },
    onCancelSearch() {
      this.$refs['search-list'].clearList();
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">

</style>
