<template>
  <van-cell
    class="info-cell"
    :border="false"
    :is-link="isLink"
    :url="url"
    @click="handleClick"
  >
    <div slot="title" class="content">
      <span v-if="title" class="title">{{ title }}</span>
      <slot />
    </div>
  </van-cell>
</template>

<script>
import { Cell } from 'vant';

export default {
  components: {
    'van-cell': Cell,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
  },

  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.info-cell {
  .van-cell__title {
    overflow: hidden;
  }

  .van-cell__right-icon {
    align-self: center;
    color: $gray-icon-color;
  }
}

.content {
  display: flex;
  font-size: 13px;
  color: $main-text-color;

  .title {
    flex-shrink: 0;
    margin-right: 16px;
    color: $disabled-color;
  }
}
</style>
