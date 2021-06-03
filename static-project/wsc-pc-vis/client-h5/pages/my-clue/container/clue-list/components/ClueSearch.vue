<template>
  <div class="clue-search-wrap">
    <div v-if="!isInput" class="clue-search-wrap__btn">
      <van-button class="clue-search-wrap__btn-button" @click="onShowSearchInput">
        <van-icon name="search" color="#969799" size="14px" />
        <span class="clue-search-wrap__btn-text">请输入姓名或手机号</span>
      </van-button>
    </div>
    <div
      v-else
      class="clue-search-wrap__search">
      <form action="/">
        <van-search
          v-model="keyword"
          placeholder="请输入姓名或手机号"
          show-action
          shape="round"
          autofocus
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { Button, Icon, Search } from 'vant';
// import { Icon } from '@youzan/vis-ui';

export default {
  name: 'clue-search',

  components: {
    'van-button': Button,
    'van-icon': Icon,
    'van-search': Search,
  },

  props: {
    isInput: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      keyword: '',
    };
  },

  methods: {
    onShowSearchInput() {
      this.$router.push({ path: 'clue-search' });
    },
    onSearch() {
      this.$emit('doSearch', this.keyword);
    },
    onCancel() {
      this.$router.push({ path: 'clue-list' });
    },
  },
};
</script>

<style lang="postcss">
.clue-search-wrap {
  width: 100%;
  height: 54px;
  background-color: #fff;

  &__btn {
    padding: 10px 15px;

    &-button {
      width: 100%;
      height: 34px;
      line-height: 1;
      text-align: center;
      font-size: 14px;
      color: #c8c9cc;
      background-color: #f7f8fa;
      border-radius: 17px;
      border: none;
    }

    &-text {
      vertical-align: text-top;
    }
  }

  &__search {
    /* display: flex; */

    &-input {
      height: 34px;
      line-height: 34px;
      padding: 0 15px;
      background-color: #f7f8fa;
      border-radius: 17px;
    }

    &-cancel {
      width: 40px;
      height: 34px;
      line-height: 34px;
      margin-left: 5px;
      text-align: center;
      font-size: 16px;
      color: #323233;
    }
  }
}
</style>
