<template>
  <div class="search-bar">
    <form action="/">
      <van-search
        v-model="searchContent"
        placeholder="请输入学员姓名或手机号"
        input-align="center"
        shape="round"
        @search="onSearch"
        @clear="onClear"
      />
    </form>
  </div>
</template>

<script>
import { Search } from 'vant';

export default {
  name: 'search-bar',

  components: {
    'van-search': Search,
  },

  data() {
    return {
      searchContent: '',
    };
  },

  methods: {
    onSearch() {
      console.log('搜索', this.searchContent);

      this.$emit('search', this.searchContent);
    },
    onClear() {
      this.$emit('clear');
    },
  },
};
</script>

<style lang="postcss">
.search-bar {
  background: #fff;
}
</style>
