<template>
  <van-cell-group :border="false">
    <component :is="sticky ? 'van-sticky' : 'div'">
      <van-cell
        v-if="title || $slots.title"
        class="head"
        title-class="title"
        value-class="value"
        :title="title"
        :is-link="hasMore"
        :value="value"
        :url="url"
        :border="false"
        @click="click"
      >
        <slot slot="title" name="title" />
        <slot name="title-right" />
      </van-cell>
    </component>
    <slot />
  </van-cell-group>
</template>

<script>
import { Cell, CellGroup, Sticky } from 'vant';

export default {
  components: {
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    'van-sticky': Sticky,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    hasMore: Boolean,
    moreText: {
      type: String,
      default: '查看全部',
    },
    url: {
      type: String,
      default: '',
    },
    sticky: Boolean,
  },

  computed: {
    value() {
      if (this.hasMore) {
        return this.moreText;
      }
      return '';
    },
  },

  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.head {
  .van-cell__right-icon {
    color: $gray-icon-color;
  }
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: $main-text-color;
}

.value {
  font-size: 12px;
  color: $disabled-color;
}
</style>
