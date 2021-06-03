<template>
  <div class="search-selector">
    <vis-popup
      v-model="show"
      :title="title"
      :buttons="buttons"
    >
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        clearable
        shape="round"
        @input="onSearch"
      />
      <slot />
    </vis-popup>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { Search } from 'vant';
import { Popup } from '@youzan/vis-ui';

export default {
  name: 'search-selector',

  components: {
    'van-search': Search,
    'vis-popup': Popup,
  },

  props: {
    value: Boolean,
    title: {
      type: String,
      default: '选择内容',
    },
  },

  data() {
    return {
      show: false,
      searchContent: '',
    };
  },

  computed: {
    buttons() {
      return [
        {
          text: '确定',
          class: 'main-btn',
          onClick: () => this.onConfirm(),
        },
      ];
    },
  },

  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newValue) {
      this.$emit('input', newValue);
    },
    title() {
      this.searchContent = '';
    },
  },

  methods: {
    onSearch: debounce(function(searchContent) {
      this.$emit('search', searchContent);
    }, 500),

    onConfirm() {
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="postcss">
.search-selector {

  .vis-standard-popup__content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 400px;
    overflow: hidden;

    .van-search {
      flex: 0 0 auto;
    }

    .van-list {
      flex: 1 1 auto;
      overflow: auto;
    }
  }
}
</style>
