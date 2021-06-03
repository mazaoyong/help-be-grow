<template>
  <div class="vispage-search-wrap">
    <!--  -->
    <div
      v-if="!isInput && !keyword"
      class="vispage-search-wrap__btn"
    >
      <van-button
        class="vispage-search-wrap__btn-button"
        @click="onShowSearchInput"
      >
        <van-icon
          class="vispage-search-wrap__btn-icon"
          name="search"
          color="#969799"
          size="14px"
        />
        <span class="vispage-search-wrap__btn-text">{{ placeholder }}</span>
      </van-button>
    </div>

    <!--  -->
    <van-search
      v-if="!isInput && !!keyword"
      v-model.trim="keyword"
      class="vispage-search-wrap__search"
      background="#fff"
      readonly
      :placeholder="placeholder"
      :autofocus="false"
      show-action
      @cancel="onCancel"
    />

    <div
      v-if="!isInput"
      class="showcase-search-wap__mask"
      :class="{
        'showcase-search-wap__mask--keyword': !!keyword,
      }"
      @click="onShowSearchInput"
    >
      <input id="FocusMock" type="text">
    </div>

    <!--  -->
    <div
      v-show="isInput"
      class="vispage-search-wrap__search-wrap"
    >
      <form action="/">
        <van-search
          ref="searchVm"
          v-model.trim="keyword"
          class="vispage-search-wrap__search"
          background="#fff"
          shape="round"
          :placeholder="placeholder"
          :autofocus="false"
          show-action
          v-on="listeners"
        />
      </form>

      <slot name="search-list" />
    </div>
  </div>
</template>

<script>
import { Button, Icon, Search } from 'vant';
import _debounce from 'lodash/debounce';

let debounceIns;
export default {
  name: 'vispage-search',

  components: {
    'van-button': Button,
    'van-icon': Icon,
    'van-search': Search,
  },

  props: {
    placeholder: {
      type: String,
      default: '请输入课程名称',
    },
    debounceDelayTime: {
      type: Number,
      default: 300,
    },
  },

  data() {
    return {
      keyword: '',
      isInput: false,
    };
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.onChange,
        search: this.onSearch,
        cancel: this.onCancel,
        clear: this.onClear,
      };
    },
  },

  created() {
    debounceIns = _debounce(() => {
      this.$emit('doChange', this.keyword);
    }, this.debounceDelayTime);
  },

  methods: {
    onShowSearchInput() {
      this.isInput = true;
      this.$nextTick(() => {
        // van-search 没有暴露 focus 方法
        const searchEl = this.$refs.searchVm.$el.querySelector('input');
        searchEl.focus && searchEl.focus();
      });

      // 兼容 ios
      document.getElementById('FocusMock').focus();
    },
    onSearch() {
      this.$emit('doSearch', this.keyword);
    },
    onCancel() {
      this.$emit('doCancel', this.keyword);
      this.isInput = false;
    },
    onClear() {
      this.$emit('doClear', this.keyword);
    },
    onChange(value) {
      console.log('[Serach.vue] 输入', value);
      debounceIns();
    },
  },
};
</script>

<style lang="postcss">
.showcase-search-wap {
  position: relative;

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;

    input {
      width: 100px;
      height: 20px;
      margin-left: -100px;
      opacity: 0;
    }

    &--keyword {
      right: 50px;
    }
  }
}

.vispage-search-wrap {
  width: 100%;
  height: 54px;
  background-color: #fff;
  position: relative;

  &__btn {
    padding: 10px 15px;
    position: relative;

    &-button {
      width: 100%;
      height: 34px;
      font-size: 14px;
      line-height: 1;
      color: #c8c9cc;
      text-align: center;
      background-color: #f7f8fa;
      border: none;
      border-radius: 17px;
    }

    &-text {
      vertical-align: text-top;
      margin-left: 6px;
    }
  }

  &__search-wrap {
    /* position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #f8f8f8;
    z-index: 99999; */
  }

  &__search {
    padding: 10px 15px;

    .van-cell {
      padding: 3px 10px;
      height: 34px;
      border-radius: 17px !important;
      background-color: #f7f8fA;

      .van-field__body {
        height: 28px;
      }

      .van-icon-search {
        line-height: 28px;
      }
    }

    &-cancel {
      width: 40px;
      height: 34px;
      margin-left: 5px;
      font-size: 16px;
      line-height: 34px;
      color: #323233;
      text-align: center;
    }
  }

}
</style>
