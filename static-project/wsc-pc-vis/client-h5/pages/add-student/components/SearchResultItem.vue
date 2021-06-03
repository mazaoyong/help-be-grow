<template>
  <div class="search-result-item">
    <div class="search-result-item__aside">
      <van-checkbox
        v-model="isChecked"
        :disabled="disabled"
        checked-color="#00b389"
        @click="onClick"
      />
    </div>
    <div class="search-result-item__body">
      <slot />
    </div>
  </div>
</template>

<script>
import { Checkbox } from 'vant';

export default {
  name: 'search-result-item',

  components: {
    'van-checkbox': Checkbox,
  },

  props: {
    isSelected: Boolean,
    disabled: Boolean,
  },

  data() {
    return {
      isChecked: false,
    };
  },

  watch: {
    isSelected: {
      immediate: true,
      handler(newV) {
        this.isChecked = newV;
      },
    },
  },

  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit(!this.isChecked ? 'select' : 'unselect');
      }
    },
  },
};
</script>

<style lang="postcss">
.search-result-item {
  display: flex;
  padding: 16px 0;
  border-top: 1px solid #ebedf0;

  &:first-of-type {
    border-top: none;
  }

  &__aside {
    flex: 0 0 auto;
    margin-right: 9px;
  }

  &__body {
    flex: 1 1 auto;
  }
}
</style>
